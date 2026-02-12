# Company data for Datenanfragen.de

This repository contains the data that powers [Datenanfragen.de](https://www.datenanfragen.de/)/[datarequests.org](https://www.datarequests.org/), a non-profit service to help people exercise their rights under the GDPR. This includes our [company database](https://www.datarequests.org/company/) with contact details for GDPR requests to companies and other organizations, a directory of supervisory authority contact details, GDPR request templates in various languages, and curated company packs.

All data is released under a [Creative Commons CC0 1.0 Universal license](/LICENSE) and we welcome its use for other projects.

## Repository contents and structure

This repository is organized into the following directories:

* [`companies/`](/companies/): our company database with contact details for GDPR requests to companies and organizations
* [`obsolete-records/`](/obsolete-records/): an archive of deleted records in the company database (e.g. for companies that are no longer active or have been merged), ensuring that old links don't break
* [`company-packs/`](/company-packs/): curated bundles of relevant companies organized by country, helping users identify companies to send requests to
* [`supervisory-authorities/`](/supervisory-authorities/): database of contact information for data protection supervisory authorities under the GDPR
* [`templates/`](/templates/): templates for exercising the various GDPR rights, including custom templates for specific cases
* [`src/`](/src/): source code for our automated tests
* [`docs/`](/docs/): comprehensive contributor documentation

## Documentation

<!-- This is the best we can do to not completely break the existing links to the old documentation. -->
<a id="company-records"></a>
<a id="companies-we-are-interested-in"></a>
<a id="slugs"></a>
<a id="relevant-countries"></a>
<a id="request-language"></a>
<a id="data-sources"></a>
<a id="addresses"></a>
<a id="phone-and-fax-numbers"></a>
<a id="required-elements"></a>
<a id="data-formats"></a>

We maintain detailed documentation for contributors in the `docs/` folder:

### Policies

Our [policies](/docs/policy/README.md) define the rules and guidelines for the company database:

* [Purpose](/docs/policy/purpose.md)
* [Scope](/docs/policy/scope.md)
* [Verifiability](/docs/policy/verifiability.md)
* [Identifying the right contact details](/docs/policy/contact-details.md)
* [Address formats](/docs/policy/address-formats.md)
* [Personal data in company records](/docs/policy/personal-data.md)
* [Separate or combined records](/docs/policy/separate-records.md)
* [Data formats](/docs/policy/data-formats.md)

### Reference guides

You can consult our [reference documentation](/docs/reference/README.md) whenever something is unclear:

* [Company records](/docs/reference/companies.md)
* [Company packs](/docs/reference/company-packs.md)
* [Obsolete records](/docs/reference/obsolete-records.md)

<a id="contributing"></a>

## Contributing to the company database

We warmly welcome contributions! Due to the nature of the data we are collecting here, frequent changes, additions, and deletions are necessary as companies change their contact details, merge, or cease operations.

### One-off contributions

For one-off additions or edits, you can use the suggest feature through [company database](https://www.datarequests.org/company/) on our website to submit changes directly without needing to work with JSON files.

### Contributions through GitHub

For more involved edits or changes to multiple records, we recommend submitting pull requests directly to this repository. You can use our [JSON editor tool](https://company-json.datenanfragen.de/) to generate valid records more easily. Feel free to group related changes to multiple records in a single PR.

Before contributing, we recommend reading at least these key policies:

* [Purpose](/docs/policy/purpose.md)
* [Scope](/docs/policy/scope.md)
* [Verifiability](/docs/policy/verifiability.md)
* [Identifying the right contact details](/docs/policy/contact-details.md)
* [Personal data in company records](/docs/policy/personal-data.md)
* [Separate or combined records](/docs/policy/separate-records.md)

If, while working on a record, you come across something that is unclear, you can refer to the [reference guide](/docs/reference/companies.md) that is follows the structure of records.

### Community

You can chat with us through our [Matrix space](https://matrix.to/#/#datenanfragen:matrix.altpeter.me) and our [dedicated room for the company database](https://matrix.to/#/#dade-company:matrix.altpeter.me). Feel free to ask questions, pitch ideas, or just talk with the community.

### License

Please be aware that by contributing, you agree for your work to be released under a Creative Commons CC0 1.0 Universal license, as specified in the [`LICENSE`](/LICENSE) file.

## Testing records

We have an automated testing script that validates all records against our schemas and catches common errors. If you submit a pull request, your changes will automatically be tested in our CI environment.

To run tests locally:

1. Install [Node.js](https://nodejs.org/en/download/) and [Yarn](https://classic.yarnpkg.com/en/docs/install).
2. In the repository folder, run `yarn` to grab all necessary dependencies. 
3. Run `yarn test` to execute the tests.

A pre-commit hook will be automatically installed that runs the tests before each commit.
