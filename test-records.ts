const ajv = new (require('ajv'))({ verbose: true });
import fs from 'fs';
import glob from 'glob';
import path from 'path';
import {countries} from 'countries-list'
import cities from 'all-the-cities';

const autofix = process.argv[2] === '--auto-fix'; // TODO do more sophisticated parsing if we need more options

// json-forms uses the `text` format for multi-line strings.
ajv.addFormat('text', () => true);
// ajv doesn't support the `idn-email` format. As validation of email addresses isn't exactly critical for us, we'll
// just use this *very* basic check.
ajv.addFormat('idn-email', /^\S+@\S+\.\S+$/);

const cdb_schema = ajv.compile(JSON.parse(fs.readFileSync('schema.json').toString()));
const adb_schema = ajv.compile(JSON.parse(fs.readFileSync('schema-supervisory-authorities.json').toString()));

const country_name_variations = ['United States of America', 'The Netherlands', 'Republic of Singapore'];
const variation_countrycodes = ['US', 'NL', 'SG'];

const templates = glob.sync('**/*.txt', { cwd: 'templates' }).reduce((acc: Record<string, string[]>, cur: string) => {
    const [lang, name] = cur.replace('.txt', '').split('/');
    if (acc[lang]) acc[lang].push(name);
    else acc[lang] = [name];
    return acc;
}, {});

type TestEvent = {type?: 'error'|'autofix', msg: string, ref?: string, error?: unknown}
const print = (events: Record<string, TestEvent[]>) => {
    for (let file in events) {
        if (!events[file] || events[file].length === 0) continue;
        console.error(/* bold, bg red */ `\x1b[1m\x1b[41mError(s) in ${file}:\x1b[0m` /* reset */);
        events[file].forEach((/** @type TestEvent*/ event: TestEvent) => {
            if (event.msg && Object.keys(event).length === 1) {
                console.error(event.msg);
            } else if (event.msg) {
                const { msg, ...stuff } = event;
                console.error(msg, stuff);
            } else {
                console.error(event);
            }
        });
    }
};

const validator = (dir: string, schema: typeof cdb_schema, additional_checks?: ((json: object, f: string) => TestEvent[]) ) => {
    /** @type {Object.<string, Array.<TestEvent>>*/
    let events: { [s: string]: Array<TestEvent>; } = {};
    const files = glob.sync(`${dir}/*.json`);

    files.forEach((f) => {
        /** @param {TestEvent} ev */
        const add_event = (ev: TestEvent) => {
            if (!events[f]) events[f] = [];
            events[f].push(ev);
        };

        const file_content = fs.readFileSync(f).toString();
        if (!file_content.toString().endsWith('}\n'))
            add_event({ msg: "File doesn't end with exactly one newline.", type: 'error' });

        let json;
        try {
            json = JSON.parse(file_content);
        } catch (err) {
            add_event({ msg: 'Parsing JSON failed.\n', error: err, type: 'error' });
            // if parsing failed we can't do any content-related checks, we skip to the next file.
            return;
        }
        if (!schema(json)) add_event({ msg: 'Schema validation failed.\n', error: schema.errors, type: 'error' });
        if (json.slug + '.json' !== path.basename(f)) {
            add_event({ msg: `Filename "${path.basename(f)}" does not match slug "${json.slug}".`, type: 'error' });
        }
        if (additional_checks) {
            const tmp = additional_checks(json, f);
            events[f] = events[f] ? events[f].concat(tmp) : tmp;
        }
    });
    print(events);
};

function isLastLineCountry(last_line: string, country_name_variations: string[] = []) {
    return (
        Object.entries(countries).some(
            ([countrycode, v]) =>
                (!variation_countrycodes.includes(countrycode) && v.name == last_line) || v.native == last_line
        ) || country_name_variations.includes(last_line)
    );
}
/**
 *
 * @param {Object} json
 * @param {string} f
 * @returns {Array.<TestEvent>}
 */
function additional_checks(json: any, f: string): Array<TestEvent> {
    let af_json = JSON.parse(JSON.stringify(json));
    /** @type {Array.<TestEvent>} */
    let errors: Array<TestEvent> = [];
    /** @type {Array.<TestEvent>} */
    let autofixes: Array<TestEvent> = [];
    // Check for necessary `name` field in the required elements (#388).
    if (json['required-elements']) {
        const has_name_field = json['required-elements'].some((el: {type: string}) => el.type === 'name');
        if (!has_name_field)
            errors.push({
                msg: `Record has required elements but no 'name' element.`,
                ref: 'https://github.com/datenanfragen/data#required-elements',
            });
    }

    for (const prop of [
        'custom-access-template',
        'custom-erasure-template',
        'custom-rectification-template',
        'custom-objection-template',
    ]) {
        // If a record specifies a `custom-*-template` without also specifying a `request-language`, the template _must_
        // at least be available in English and _should_ also be available in the other languages (#1120).
        if (json[prop]) {
            if (json['request-language']) {
                if (!templates[json['request-language']].includes(json[prop]))
                    errors.push({
                        msg: `Record specifies '${prop}' of '${json[prop]}' but that isn't available for 'request-language' of '${json['request-language']}'.`,
                    });
            } else {
                if (!templates['en'].includes(json[prop]))
                    errors.push({
                        msg: `Record specifies '${prop}' of '${json[prop]}' but that isn't available in English.`,
                        ref: 'https://github.com/datenanfragen/data/issues/1120',
                    });
            }
        }
    }

    // A `quality` of `tested` may only be set if `required-elements` are specified (#811).
    if (json['quality'] === 'tested') {
        if (!json['required-elements'])
            errors.push({
                msg: "Record has `quality` of `tested` but doesn't specify `required-elements`.",
                ref: 'https://github.com/datenanfragen/data/issues/811',
            });
    }
    const address_lines: string[] = json['address'].split('\n');

    // whitespace check
    Object.keys(json).forEach((key) => {
        if (typeof json[key] === 'string' && json[key] !== json[key].trim()) {
            errors.push({
                msg: `Seems like \`${key}\` isn't trimmed, i.e. it contains leading or trailing whitespace.`,
            });
            if (autofix) {
                af_json[key] = json[key].trim();
                autofixes.push({ msg: `trimmed ${key}` });
            }
        }
    });

    // address formatting

    if (address_lines.length < 2) errors.push({ msg: '`address` is not formatted with newlines (\\n).' });

    if (address_lines.some((line) => line !== line.trim())) {
        errors.push({ msg: "`address` isn't trimmed (linewise), i.e. it contains unnecessary whitespace." });
        if (autofix) {
            af_json['address'] = address_lines.map((x: string) => x.trim()).join('\n');
            autofixes.push({ msg: 'trimmed address' });
        }
    }

    const lambda_contains_name = (el: string) => el.trim() === json['name'];
    if (address_lines.some(lambda_contains_name)) {
        errors.push({ msg: 'Record includes `name` in the `address`.' });
        if (autofix) {
            af_json['address'] = af_json['address']
                .split('\n')
                .filter((x: string) => !lambda_contains_name(x))
                .join('\n');
            autofixes.push({ msg: 'Removed duplicate name in first line of address' });
        }
    }

    // check if the last line is a country
    // this test might produce false-positives, as it's a difficult thing to do
    // we might consider more fuzzy matching if we get many reports of false positives

    const last_line = address_lines[address_lines.length - 1].trim();
    const last_line_is_country = isLastLineCountry(last_line, country_name_variations);

    if (!last_line_is_country) {
        errors.push({
            msg: `Last line of \`address\` (${last_line}) should be a country. If you feel like this error is a mistake, please let us know! We get our list of countries from https://www.npmjs.com/package/countries-list. We've decided on specific variations for some countries: (${country_name_variations.join(
                ', '
            )}).`,
        });
        if (autofix) {
            const city_res = /\S+ (.+)/.exec(last_line);
            if (city_res && city_res[1]) {
                const city = city_res[1];
                // TODO make this smarter, i.e. make it work with more formats
                const guess = cities.filter((x) => x.name === city).sort((a, b) => a.population - b.population)[0].country as keyof typeof countries;
                if (guess) {
                    af_json.address += `\n${
                        variation_countrycodes.includes(guess)
                            ? country_name_variations[variation_countrycodes.indexOf(guess)]
                            : countries[guess].name
                    }`;
                    autofixes.push({ msg: `guessed missing country: ${guess}` });
                }
            }
        }
    }
    if (autofix && json !== af_json) fs.writeFileSync(f, JSON.stringify(af_json, null, 4) + '\n'); // TODO add replacer for re-ordering, see suggest in website

    /**
     * re-use when we've implemented warnings, this shouldn't be a hard fail
     *
    // set suggested-transport-medium if email is privacy related
    // TODO: extend the regex
    if (/(privacy|dpo|dsb|datenschutz|gdpr|dsgvo).*@/.test(json['email'])) {
        if (json['suggested-transport-medium'] !== 'email')
            errors.push(
                'Record sets `email` to a privacy-related address, but doesn\'t set suggested-transport-medium": "email".'
            );
    }
     */
    /**@type Array.<TestEvent> */
    let returnevents: Array<TestEvent> = [];
    for (const a of autofixes) returnevents.push({ ...a, type: 'autofix' });
    for (const e of errors) returnevents.push({ ...e, type: 'error' });
    return returnevents;
}
validator('companies', cdb_schema, additional_checks);
validator('supervisory-authorities', adb_schema);
