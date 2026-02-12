# Data formats

## JSON files

Most of the data we collect in this repository is held as JSON files, which have to follow different schemas based on the type:

* company records in [`/companies`](https://github.com/datenanfragen/data/tree/master/companies): [`schema.json`](https://github.com/datenanfragen/data/blob/master/schema.json)
* company packs in [`/company-packs`](https://github.com/datenanfragen/data/tree/master/company-packs): [`schema-company-packs.json`](https://github.com/datenanfragen/data/blob/master/schema-company-packs.json)
* obsolete company records in [`/obsolete-records`](https://github.com/datenanfragen/data/tree/master/obsolete-records): [`schema-obsolete-records.json`](https://github.com/datenanfragen/data/blob/master/schema-obsolete-records.json)
* supervisory authority records in [`/supervisory-authorities`](https://github.com/datenanfragen/data/tree/master/supervisory-authorities): [`schema-supervisory-authorities.json`](https://github.com/datenanfragen/data/blob/master/schema-supervisory-authorities.json)

All JSON files must be formatted according to [`JSON.stringify(<data>, null, 4)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) and end with exactly one newline. All string fields in records must be trimmed (i.e. not have any leading or trailing whitespace).

Only use regular ASCII spaces, no non-breaking spaces or similar.

## Templates

The templates in [`/templates`](https://github.com/datenanfragen/data/tree/master/companies) are plaintext files that can make use of [our custom markup language](https://github.com/datenanfragen/letter-generator) for variables and flags.
