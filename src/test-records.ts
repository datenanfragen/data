import fs from 'fs';
import { join, relative } from 'path';
import arg from 'arg';
import glob from 'glob';
import json_map, { JsonSourceMap } from 'json-source-map';
import { omit, pick } from 'filter-anything';
import * as jsonpointer from 'jsonpointer';
import pc from 'picocolors';
import asTable from 'as-table';
import marked from 'marked';
import TerminalRenderer from 'marked-terminal';
import _linters from './checks';
import { locatorFactory } from './common/locator';
import { GenericRecord } from './types/records';
import { CheckInstance, RdjsonLine } from './types/checks';

marked.setOptions({ renderer: new TerminalRenderer({ reflowText: true, width: process.stdout.columns - 10, tab: 2 }) });

const args = arg({ '--reviewdog': Boolean, '--dir': String, '-d': '--d' });
const base_dir = args['--dir'] || '.';

let exit_code = 0;

// TODO: Add replacer for re-ordering, see `suggest-edit.js` in `website`.

// The `suggested-transport-medium` _should_ be set to `email` for privacy-specific email addresses.
// TODO: This is disabled until we have implemented warnings as this shouldn't be a hard fail. It should also only fail
// in PRs, but not after it has already been merged.
// TODO: Extend the regex.
// if (/(privacy|dpo|dsb|datenschutz|gdpr|dsgvo).*@/.test(json['email'])) {
//     if (json['suggested-transport-medium'] !== 'email')
//         errors.push(
//             'Record sets `email` to a privacy-specific address, but doesn\'t set suggested-transport-medium": "email".'
//         );
// }
const validate = async (dir: string) => {
    const check_results: RdjsonLine[] = [];

    const linters = await _linters();
    const files = glob.sync(`${dir}/*.json`);

    for (const f of files) {
        const file_content = fs.readFileSync(f).toString();
        const rel_path = relative(base_dir, f);

        let json: GenericRecord;
        let pointers: Record<string, JsonSourceMap>;
        try {
            ({ data: json, pointers } = json_map.parse(file_content));
        } catch (err) {
            // If parsing failed, we can't do any content-related checks, so skip to the next file.
            // TODO: Use ajv's parser, which is supposed to have more helpful errors?
            check_results.push({
                message: `Record is not a valid JSON file.\n\nRaw error:\n\`\`\`json\n${JSON.stringify(
                    err,
                    ['message', 'name', 'stack'],
                    4
                )}\n\`\`\``,
                location: { path: rel_path, range: { start: { line: 1 } } },
                severity: 'ERROR',
                code: { value: 'valid-json', url: 'https://github.com/datenanfragen/data#data-formats' },
                source: { name: 'recordlint' },
            });
            continue;
        }

        const locator = locatorFactory(pointers);
        const diffAfterReplacement = (pointer: string, value: unknown) => {
            const copy = JSON.parse(JSON.stringify(json));
            jsonpointer.set(copy, pointer, value);
            const { pointers: new_pointers, json: new_json } = json_map.stringify(copy, null, 4);

            const location = locatorFactory(new_pointers)(pointer);
            if (!location) return '';

            return new_json
                .split('\n')
                .slice(location.start.line - 1, location.end.line)
                .join('\n');
        };

        for (const [name, { checks, url, path_filter }] of Object.entries(linters)) {
            if (!path_filter(rel_path)) continue;

            for (const check of checks) {
                const res = check.run(json, { locator, file_path: rel_path, file_content }) || [];
                check_results.push(
                    // Really not sure why the cast is necessary here…
                    ...(Array.isArray(res) ? (res.filter((r) => r) as CheckInstance[]) : [res])
                        .map((r) => ({ ...omit(check, ['run']), ...r }))
                        .map((r) => ({
                            ...pick(r, ['message', 'severity']),
                            location: {
                                path: rel_path,
                                range: r.location || (r.json_pointer && locator(r.json_pointer)) || undefined,
                            },
                            code: { value: r.id, url: r.url },
                            source: { name, url },
                            ...(r.suggestions &&
                                r.suggestions.length > 0 && {
                                    suggestions: r.suggestions.map((s) => ({
                                        range:
                                            r.location ||
                                            (r.json_pointer && locator(r.json_pointer, 'value')) ||
                                            locator('')!,
                                        text: r.location ? (s as string) : diffAfterReplacement(r.json_pointer!, s),
                                    })),
                                }),
                        }))
                );
            }
        }
    }

    if (args['--reviewdog']) console.log(check_results.map((r) => JSON.stringify(r)).join('\n'));
    else {
        const results_per_file = check_results.reduce<Record<string, RdjsonLine[]>>((acc, cur) => {
            if (!acc[cur.location.path]) acc[cur.location.path] = [];
            acc[cur.location.path].push(cur);
            return acc;
        }, {});
        const log = (str = '', padding = 0) =>
            console.log(
                str
                    .split('\n')
                    .map((s) => ''.padStart(padding) + s)
                    .join('\n')
            );
        const symbols = {
            UNKNOWN_SEVERITY: pc.blue('?'),
            ERROR: pc.red('×'),
            WARNING: pc.yellow('‼'),
            INFO: pc.blue('i'),
        };

        for (const [file, results] of Object.entries(results_per_file)) {
            log(pc.underline(pc.bold(file)));

            // `as-table` doesn't support multi-line text, so we have to hack that.
            const data = results.map((res) => ({
                row: [
                    pc.bold(symbols[res.severity || 'UNKNOWN_SEVERITY']),
                    `l. ${pc.magenta(pc.bold(res.location.range?.start.line || '?'))}${
                        res.location.range?.end && res.location.range?.start.line !== res.location.range?.end.line
                            ? `–${pc.magenta(pc.bold(res.location.range?.end?.line))}`
                            : ''
                    }:`,
                    `${pc.cyan(pc.bold(`${res.source?.name}/${res.code?.value}`))} ${
                        res.code?.url ? `(${pc.gray(res.code?.url)})` : ''
                    }`,
                ],
                res,
            }));
            const table = asTable(data.map((r) => r.row)).split('\n');
            for (let i = 0; i < data.length; i++) {
                log(table[i], 2);
                log(marked(data[i].res.message).trim(), 5);
                const suggestions = data[i].res.suggestions;
                if (suggestions && suggestions.length) {
                    log();
                    log('Suggestions:', 5);
                    log(
                        marked(
                            suggestions.map((s) => `* \`\`\`\n  ${s.text.trim() || '(remove it)'}\n  \`\`\``).join('\n')
                        ).trim(),
                        5
                    );
                }
            }

            log();
            log();
        }
    }

    if (check_results.flat().filter((r) => r.severity === 'ERROR').length > 0) exit_code = 1;
};

(async () => {
    await validate(join(base_dir, 'companies'));
    await validate(join(base_dir, 'supervisory-authorities'));
    process.exit(exit_code);
})();
