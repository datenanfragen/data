const ajv = new (require('ajv'))({ verbose: true });
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const countries = require('countries-list').countries;
const cities = require('all-the-cities');

const tr = require('./test-records.js');

// json-forms uses the `text` format for multi-line strings.
ajv.addFormat('text', (a) => true);
// ajv doesn't support the `idn-email` format. As validation of email addresses isn't exactly critical for us, we'll
// just use this *very* basic check.
ajv.addFormat('idn-email', /^\S+@\S+\.\S+$/);

const schema = ajv.compile(JSON.parse(fs.readFileSync('schema.json').toString()));

const files = glob.sync(`companies/*.json`);

files.forEach((f) => {
    const file_content = fs.readFileSync(f).toString();

    let json;
    let json_old;
    try {
        json = JSON.parse(file_content);
        json_old = JSON.parse(JSON.stringify(json));
    } catch (err) {
        console.error('Skipping:', f, err);
        // if parsing failed we can't do any content-related things, we skip to the next file.
        return;
    }

    if (!schema(json)) {
        console.error('Skipping:', f, err);
        return;
    }
    // This is quite unsophisticated, we might want to implement something smarter in the future
    json.slug = path.basename(f).substring(0, path.basename(f).length - '.json'.length);

    Object.keys(json).forEach((key) => {
        if (typeof json[key] === 'string') json[key] = json[key].trim();
    });

    if (json.address) {
        // trim every line of the address
        json.address = json.address
            .split('\n')
            .map((line) => line.trim())
            .join('\n');
    }

    // now the things that depend on our scheme
    if (
        json.email &&
        !json['suggested-transport-medium'] &&
        /(privacy|dpo|dsb|datenschutz|gdpr|dsgvo).*@/.test(json['email'])
    )
        json['suggested-transport-medium'] = 'email';

    const address_lines = json['address'].split('\n');
    const last_line = address_lines[address_lines.length - 1].trim();

    if (!tr.isLastLineCountry(last_line, tr.country_name_variations)) {
        const city = /[\d ]* ([\S ]*)/.exec(last_line)[1]; // TODO make this smarter, i.e. make it work with more formats
        const guess = cities.filter((x) => x.name === city)[0];
        if (guess)
            json.address = `\n${
                tr.variation_countrycodes.includes(guess.country)
                    ? tr.country_name_variations[tr.variation_countrycodes.indexOf(guess.country)]
                    : countries[guess.country].name
            }`;
    }
    if (json !== json_old) fs.writeFileSync(f, JSON.stringify(json, null, 4) + '\n'); // TODO add replacer for re-ordering, see suggest in website
});
