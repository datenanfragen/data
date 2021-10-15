import fs from 'fs';
import glob from 'glob';
import path from 'path';
import { countries } from 'countries-list';
import cities from 'all-the-cities';
import { ajv } from './common/ajv';
import { Common } from './common/ts';
import { AuthorityRecord } from './types/AuthorityRecord';
import { CompanyRecord } from './types/CompanyRecord';
import cdb_json_schema from '../schema.json';
import adb_json_schema from '../schema-supervisory-authorities.json';

type GenericRecord = Common<AuthorityRecord, CompanyRecord>;
type TestEvent =
    | { type: 'error'; msg: string; ref?: string; error?: unknown }
    | { type: 'autofix'; msg: string; ref?: string };

const autofix = process.argv[2] === '--auto-fix'; // TODO: Do more sophisticated parsing if we need more options.

const cdb_schema = ajv.compile(cdb_json_schema);
const adb_schema = ajv.compile(adb_json_schema);

const country_name_variations = ['United States of America', 'The Netherlands', 'Republic of Singapore'];
const variation_country_codes = ['US', 'NL', 'SG'];

const templates = glob.sync('**/*.txt', { cwd: 'templates' }).reduce((acc, cur) => {
    const [lang, name] = cur.replace('.txt', '').split('/');
    if (!acc[lang]) acc[lang] = [];
    acc[lang].push(name);
    return acc;
}, {} as Record<string, string[]>);

const validate = (
    dir: string,
    schema: typeof cdb_schema | typeof adb_schema,
    additional_checks?:
        | ((json: CompanyRecord, file: string) => TestEvent[])
        | ((json: AuthorityRecord, file: string) => TestEvent[])
) => {
    const events: { [slug: string]: TestEvent[] } = {};
    const files = glob.sync(`${dir}/*.json`);

    for (const f of files) {
        const add_event = (ev: TestEvent) => {
            if (!events[f]) events[f] = [];
            events[f].push(ev);
        };

        const file_content = fs.readFileSync(f).toString();

        // JSON files have to end with exactly one newline.
        if (!file_content.toString().endsWith('}\n'))
            add_event({ msg: "File doesn't end with exactly one newline.", type: 'error' });

        let json: GenericRecord;
        try {
            json = JSON.parse(file_content);
        } catch (err) {
            add_event({ msg: 'Parsing JSON failed.\n', error: err, type: 'error' });
            // If parsing failed, we can't do any content-related checks, so skip to the next file.
            continue;
        }

        // Records have to pass schema validation.
        if (!schema(json)) add_event({ msg: 'Schema validation failed.\n', error: schema.errors, type: 'error' });

        // Record filenames have to match their slug.
        if (json.slug + '.json' !== path.basename(f))
            add_event({ msg: `Filename "${path.basename(f)}" does not match slug "${json.slug}".`, type: 'error' });

        if (additional_checks) {
            if (!events[f]) events[f] = [];
            events[f].push(...additional_checks(json as CompanyRecord, f));
        }
    }

    for (const file in events) {
        if (!events[file] || events[file].length === 0) continue;

        console.error(/* bold, bg red */ `\x1b[1m\x1b[41mError(s) in ${file}:\x1b[0m` /* reset */);
        for (const event of events[file]) {
            if (event.msg && Object.keys(event).length === 1) console.error(event.msg);
            else if (event.msg) {
                const { msg, ...rest } = event;
                console.error(msg, rest);
            } else console.error(event);
        }
    }
    // TODO: filter for type 'error'. In the feature we might have autofixes or other events without errors.
    if (Object.values(events).flat().length > 0) process.exit(1);
};

const company_checks = (json: CompanyRecord, f: string): TestEvent[] => {
    const json_with_fixes: CompanyRecord = JSON.parse(JSON.stringify(json));
    const events: TestEvent[] = [];

    // If `required-elements` are specified, one has to be of type `name` (#388).
    if (json['required-elements']) {
        const has_name_field = json['required-elements'].some((el) => el.type === 'name');
        if (!has_name_field)
            events.push({
                msg: `Record has required elements but no 'name' element.`,
                ref: 'https://github.com/datenanfragen/data#required-elements',
                type: 'error',
            });
    }

    // If a record specifies a `custom-*-template` without also specifying a `request-language`, the template _must_ at
    // least be available in English and _should_ also be available in the other languages (#1120).
    for (const prop of [
        'custom-access-template',
        'custom-erasure-template',
        'custom-rectification-template',
        'custom-objection-template',
    ] as const) {
        const template = json[prop];
        if (template) {
            if (json['request-language']) {
                if (!templates[json['request-language']].includes(template))
                    events.push({
                        msg: `Record specifies '${prop}' of '${template}' but that isn't available for 'request-language' of '${json['request-language']}'.`,
                        type: 'error',
                    });
            } else {
                if (!templates['en'].includes(template))
                    events.push({
                        msg: `Record specifies '${prop}' of '${template}' but that isn't available in English.`,
                        ref: 'https://github.com/datenanfragen/data/issues/1120',
                        type: 'error',
                    });
            }
        }

        // If a record has 'custom-access-template' set, then it cannot have a 'required-elements' parameter set
        if (template) {
            if (!json['required-elements'])  
            events.push({
                msg: "If a record has 'custom-access-template' set, then it cannot have a 'required-elements' parameter set",
                ref: 'https://github.com/datenanfragen/data/issues/1445',
                type: 'error',
            });
        }
    }

    // A `quality` of `tested` may only be set if `required-elements` are specified (#811).
    if (json['quality'] === 'tested') {
        if (json['required-elements'])
            events.push({
                msg: "Record has `quality` of `tested` but doesn't specify `required-elements`.",
                ref: 'https://github.com/datenanfragen/data/issues/811',
                type: 'error',
            });
    }

    // String field values cannot have trailing or leading whitespace.
    for (const key of Object.keys(json) as (keyof CompanyRecord)[]) {
        const value = json[key];
        if (typeof value === 'string' && value !== value.trim()) {
            events.push({
                msg: `Seems like \`${key}\` isn't trimmed, i.e. it contains leading or trailing whitespace.`,
                type: 'error',
            });
            if (autofix) {
                (json_with_fixes[key] as string) = value.trim();
                events.push({ msg: `Trimmed ${key}.`, type: 'autofix' });
            }
        }
    }

    const address_lines = json['address'].split('\n');

    // Address lines have to be separated by newlines.
    if (address_lines.length < 2)
        events.push({ msg: '`address` is not formatted with newlines (\\n).', type: 'error' });

    // The lines of the address cannot have trailing or leading whitespace.
    if (address_lines.some((line) => line !== line.trim())) {
        events.push({
            msg: "`address` isn't trimmed (linewise), i.e. at least one line contains trailing or leading whitespace.",
            type: 'error',
        });
        if (autofix) {
            json_with_fixes['address'] = address_lines.map((line) => line.trim()).join('\n');
            events.push({ msg: 'Trimmed address.', type: 'autofix' });
        }
    }

    // The name of the company cannot be contained in the address.
    const contains_company_name = (el: string) => el.trim() === json['name'];
    if (address_lines.some(contains_company_name)) {
        events.push({ msg: 'Record includes `name` in the `address`.', type: 'error' });
        if (autofix) {
            json_with_fixes['address'] = json_with_fixes['address']
                .split('\n')
                .filter((x) => !contains_company_name(x))
                .join('\n');
            events.push({ msg: 'Removed duplicate name in address.', type: 'autofix' });
        }
    }

    // The last line of the address has to be a country.
    const isCountry = (str: string) =>
        Object.entries(countries).some(
            ([country_code, c]) =>
                (!variation_country_codes.includes(country_code) && str == c.name) || str === c.native
        ) || country_name_variations.includes(str);

    const last_line = address_lines[address_lines.length - 1].trim();
    const last_line_is_country = isCountry(last_line);
    if (!last_line_is_country) {
        events.push({
            msg: `Last line of \`address\` (\`${last_line}\`) should be a country. If you feel like this error is a mistake, please let us know! We've decided on specific variations for these countries: (${country_name_variations.join(
                ', '
            )}).`,
            type: 'error',
        });
        if (autofix) {
            // Try to guess the country from the city.
            // TODO: Currently only works if the last line has the following format: `<ZIP> <city>`. Make this work with
            // more formats.
            const city_match = /\S+ (.+)/.exec(last_line);
            if (city_match && city_match[1]) {
                const city = city_match[1];
                const guess = cities.filter((c) => c.name === city).sort((a, b) => a.population - b.population)[0]
                    ?.country as keyof typeof countries;
                if (guess) {
                    json_with_fixes.address += `\n${
                        variation_country_codes.includes(guess)
                            ? country_name_variations[variation_country_codes.indexOf(guess)]
                            : countries[guess].name
                    }`;
                    events.push({ msg: `Guessed missing country: "${guess}".`, type: 'autofix' });
                }
            }
        }
    }

    // TODO: Add replacer for re-ordering, see `suggest-edit.js` in `website`.

    // The `suggested-transport-medium` _should_ be set to `email` for privacy-specific email addresses.
    // TODO: This is disabled until we have implemented warnings as this shouldn't be a hard fail. It should also only
    // fail in PRs, but not after it has already been merged.
    // TODO: Extend the regex.
    // if (/(privacy|dpo|dsb|datenschutz|gdpr|dsgvo).*@/.test(json['email'])) {
    //     if (json['suggested-transport-medium'] !== 'email')
    //         errors.push(
    //             'Record sets `email` to a privacy-specific address, but doesn\'t set suggested-transport-medium": "email".'
    //         );
    // }

    if (autofix && json !== json_with_fixes) fs.writeFileSync(f, JSON.stringify(json_with_fixes, null, 4) + '\n');

    return events;
};

validate('companies', cdb_schema, company_checks);
validate('supervisory-authorities', adb_schema);
