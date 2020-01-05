const ajv = new (require('ajv'))({ verbose: true });
const fs = require('fs');
const glob = require('glob');
const path = require('path');

// json-forms uses the `text` format for multi-line strings.
ajv.addFormat('text', a => true);
// ajv doesn't support the `idn-email` format. As validation of email addresses isn't exactly critical for us, we'll
// just use this *very* basic check.
ajv.addFormat('idn-email', /^\S+@\S+\.\S+$/);

const cdb_schema = ajv.compile(JSON.parse(fs.readFileSync('schema.json')));
const adb_schema = ajv.compile(JSON.parse(fs.readFileSync('schema-supervisory-authorities.json')));

const fail = (...args) => {
    console.error(...args);
    process.exit(1);
};
const validator = (dir, schema, additional_checks = null) => {
    glob(`${dir}/*.json`, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }

        files.forEach(f => {
            const json = JSON.parse(fs.readFileSync(f));

            if (!schema(json)) fail(`Error in ${f}:\n`, schema.errors);
            if (json.slug + '.json' !== path.basename(f)) {
                fail(`${dir} filename "${path.basename(f)}" does not match slug "${json.slug}".`);
            }

            if (additional_checks) additional_checks(f, json);
        });
    });
};

validator('companies', cdb_schema, (f, json) => {
    // Check for necessary 'name' field in the required elements (#388).
    if (json['required-elements']) {
        const has_name_field = json['required-elements'].some(el => el.type === 'name');
        if (!has_name_field)
            fail(
                `Error in ${f}:\nRecord has required elements but no 'name' element (see https://github.com/datenanfragen/data#required-elements).`
            );
    }
});
validator('supervisory-authorities', adb_schema);
