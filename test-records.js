const ajv = new (require('ajv'))({ verbose: true });
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const countries = require('countries-list').countries;

// json-forms uses the `text` format for multi-line strings.
ajv.addFormat('text', (a) => true);
// ajv doesn't support the `idn-email` format. As validation of email addresses isn't exactly critical for us, we'll
// just use this *very* basic check.
ajv.addFormat('idn-email', /^\S+@\S+\.\S+$/);

const cdb_schema = ajv.compile(JSON.parse(fs.readFileSync('schema.json').toString()));
const adb_schema = ajv.compile(JSON.parse(fs.readFileSync('schema-supervisory-authorities.json').toString()));

const country_name_variations = ['United States of America', 'The Netherlands', 'Republic of Singapore'];
const variation_countrycodes = ['US', 'NL', 'SG'];

const templates = glob.sync('**/*.txt', { cwd: 'templates' }).reduce((acc, cur) => {
    const [lang, name] = cur.replace('.txt', '').split('/');
    if (acc[lang]) acc[lang].push(name);
    else acc[lang] = [name];
    return acc;
}, {});

const fail = (errors) => {
    for (let file in errors) {
        console.error(/* bold, bg red */ `\x1b[1m\x1b[41mError(s) in ${file}:\x1b[0m` /* reset */);
        for (let error of errors[file]) {
            if (error.msg && Object.keys(error).length === 1) {
                console.error(error.msg);
            } else if (error.msg) {
                const { msg, ...stuff } = error;
                console.error(msg, stuff);
            } else {
                console.error(error);
            }
        }
    }
    process.exit(1);
};
const validator = (dir, schema, additional_checks = null) => {
    let errors = {};
    const files = glob.sync(`${dir}/*.json`);

    files.forEach((f) => {
        const add_error = (err) => {
            if (!errors[f]) errors[f] = [];
            errors[f].push(err);
        };

        const file_content = fs.readFileSync(f).toString();
        if (!file_content.toString().endsWith('}\n')) add_error({ msg: "File doesn't end with exactly one newline." });

        let json;
        try {
            json = JSON.parse(file_content);
        } catch (err) {
            add_error({ msg: 'Parsing JSON failed.\n', errors: err });
            // if parsing failed we can't do any content-related checks, we skip to the next file.
            return;
        }
        if (!schema(json)) add_error({ msg: 'Schema validation failed.\n', errors: schema.errors });
        if (json.slug + '.json' !== path.basename(f)) {
            add_error({ msg: `Filename "${path.basename(f)}" does not match slug "${json.slug}".` });
        }
        if (additional_checks) {
            for (const e of additional_checks(json)) {
                add_error(e);
            }
        }
    });
    if (Object.keys(errors).length > 0) fail(errors);
};

function isLastLineCountry(last_line, country_name_variations = []) {
    return (
        Object.entries(countries).some(
            ([countrycode, v]) =>
                (!variation_countrycodes.includes(countrycode) && v.name == last_line) || v.native == last_line
        ) || country_name_variations.includes(last_line)
    );
}
module.exports = { isLastLineCountry, country_name_variations, variation_countrycodes };

if (module.parent) return;
validator('companies', cdb_schema, (json) => {
    let errors = [];
    // Check for necessary `name` field in the required elements (#388).
    if (json['required-elements']) {
        const has_name_field = json['required-elements'].some((el) => el.type === 'name');
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
    // whitespace check
    Object.keys(json).forEach((key) => {
        if (typeof json[key] === 'string' && json[key] !== json[key].trim())
            errors.push(`Seems like \`${key}\` isn't trimmed, i.e. it contains leading or trailing whitespace.`);
    });

    // address formatting
    const address_lines = json['address'].split('\n');
    if (address_lines.length < 2) errors.push('`address` is not formatted with newlines (\\n).');

    if (address_lines.some((line) => line !== line.trim())) {
        errors.push("`address` isn't trimmed (linewise), i.e. it contains unnecessary whitespace.");
    }

    if (address_lines.includes(json['name'])) errors.push('Record includes `name` in the `address`.');

    // check if the last line is a country
    // this test might produce false-positives, as it's a difficult thing to do
    // we might consider more fuzzy matching if we get many reports of false positives

    const last_line = address_lines[address_lines.length - 1].trim();
    const last_line_is_country = isLastLineCountry(last_line, country_name_variations);

    if (!last_line_is_country)
        errors.push(
            `Last line of \`address\` (${last_line}) should be a country. If you feel like this error is a mistake, please let us know! We get our list of countries from https://www.npmjs.com/package/countries-list. We've decided on specific variations for some countries: (${country_name_variations.join(
                ', '
            )}).`
        );

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
    return errors;
});
validator('supervisory-authorities', adb_schema);
