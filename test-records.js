const ajv = new (require('ajv'))({ verbose: true });
const fs = require('fs');
const glob = require('glob');
const path = require('path');

// json-forms uses the `text` format for multi-line strings.
ajv.addFormat('text', (a) => true);
// ajv doesn't support the `idn-email` format. As validation of email addresses isn't exactly critical for us, we'll
// just use this *very* basic check.
ajv.addFormat('idn-email', /^\S+@\S+\.\S+$/);

const cdb_schema = ajv.compile(JSON.parse(fs.readFileSync('schema.json')));
const adb_schema = ajv.compile(JSON.parse(fs.readFileSync('schema-supervisory-authorities.json')));

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
            const file_content = fs.readFileSync(f);
            if (!file_content.toString().endsWith('}\n')) fail("File doesn't end with exactly one newline.");

            const json = JSON.parse(file_content);
            if (!schema(json)) fail('Schema validation failed.\n', schema.errors);
            if (json.slug + '.json' !== path.basename(f)) {
                fail(`Filename "${path.basename(f)}" does not match slug "${json.slug}".`);
            }

            if (additional_checks) additional_checks(json);
        });
    });
};

validator('companies', cdb_schema, (json) => {
    // Check for necessary 'name' field in the required elements (#388).
    if (json['required-elements']) {
        const has_name_field = json['required-elements'].some((el) => el.type === 'name');
        if (!has_name_field)
            fail(
                `Record has required elements but no 'name' element.`,
                'See: https://github.com/datenanfragen/data#required-elements'
            );
    }
});
validator('supervisory-authorities', adb_schema);
