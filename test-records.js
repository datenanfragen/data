const ajv = new (require('ajv'))({ verbose: true });
const fs = require('fs');
const glob = require('glob');
const path = require('path');

// json-forms uses the `text` format for multi-line strings.
ajv.addFormat('text', (a) => true);
// ajv doesn't support the `idn-email` format. As validation of email addresses isn't exactly critical for us, we'll
// just use this *very* basic check.
ajv.addFormat('idn-email', /^\S+@\S+\.\S+$/);

const cdb_schema = ajv.compile(JSON.parse(fs.readFileSync('schema.json').toString()));
const adb_schema = ajv.compile(JSON.parse(fs.readFileSync('schema-supervisory-authorities.json').toString()));

const templates = glob.sync('**/*.txt', { cwd: 'templates' }).reduce((acc, cur) => {
    const [lang, name] = cur.replace('.txt', '').split('/');
    if (acc[lang]) acc[lang].push(name);
    else acc[lang] = [name];
    return acc;
}, {});

// This ain't exactly pretty but globally remember the file name so we don't have to manually pass it to `fail()`.
let f = undefined;

const fail = (...args) => {
    if (f) console.error(/* bold, bg red */ `\x1b[1m\x1b[41mError in ${f}:\x1b[0m` /* reset */);
    console.error(...args);
    process.exit(1);
};
const validator = (dir, schema, additional_checks = null) => {
    glob(`${dir}/*.json`, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }

        files.forEach((_f) => {
            f = _f;
            const file_content = fs.readFileSync(f).toString();
            if (!file_content.toString().endsWith('}\n')) fail("File doesn't end with exactly one newline.");

            let json;
            try {
                json = JSON.parse(file_content);
            } catch (err) {
                fail('Parsing JSON failed.\n', err);
            }
            if (!schema(json)) fail('Schema validation failed.\n', schema.errors);
            if (json.slug + '.json' !== path.basename(f)) {
                fail(`Filename "${path.basename(f)}" does not match slug "${json.slug}".`);
            }

            if (additional_checks) additional_checks(json);
        });
    });
};

validator('companies', cdb_schema, (json) => {
    // Check for necessary `name` field in the required elements (#388).
    if (json['required-elements']) {
        const has_name_field = json['required-elements'].some((el) => el.type === 'name');
        if (!has_name_field)
            fail(
                `Record has required elements but no 'name' element.`,
                'See: https://github.com/datenanfragen/data#required-elements'
            );
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
                    fail(
                        `Record specifies '${prop}' of '${json[prop]}' but that isn't available for 'request-language' of '${json['request-language']}'.`
                    );
            } else {
                if (!templates['en'].includes(json[prop]))
                    fail(
                        `Record specifies '${prop}' of '${json[prop]}' but that isn't available in English.`,
                        'See: https://github.com/datenanfragen/data/issues/1120'
                    );
            }
        }
    }

    // A `quality` of `tested` may only be set if `required-elements` are specified (#811).
    if (json['quality'] === 'tested') {
        if (!json['required-elements'])
            fail(
                "Record has `quality` of `tested` but doesn't specify `required-elements`.",
                'See: https://github.com/datenanfragen/data/issues/811'
            );
    }
});
validator('supervisory-authorities', adb_schema);
