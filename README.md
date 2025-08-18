# Company data for Datenanfragen.de

This repository contains a directory of contact information and privacy-related data on companies (and other organizations) under the scope of the EU GDPR, a directory of the supervisory data protection authorities, a collection of templates for GDPR requests in various languages and a list of suggested companies to send access requests to.  
It is used to power the Datenanfragen.de company database but we warmly welcome you to use the data for your own projects!

## Contributing

Due to the nature of the data we are collecting here, frequent changes, additions and deletions will be necessary. We invite you to contribute whatever information you have. You can add new records or edit existing ones directly through the [company database](https://www.datarequests.org/company/) on our website.  
If you want to edit many companies or do more involved edits, we recommend submitting pull requests directly to this repo (feel free to group changes to multiple records in a single PR). We have developed [this tool](https://company-json.datenanfragen.de/) to make generating valid JSON records easier.

You can chat with us through our [Matrix space](https://matrix.to/#/#datenanfragen:matrix.altpeter.me) and our [dedicated room for the company database](https://matrix.to/#/#dade-company:matrix.altpeter.me). Feel free to ask questions, pitch your ideas, or just talk with the community.

Please be aware that by contributing, you agree for your work to be released under a Creative Commons CC0 1.0 Universal license, as specified in the `LICENSE` file.

### Testing records

We have an automated testing script for the records. The script makes sure that all records follow our schema and catches common errors.

If you submit a PR, your changes will automatically be tested in our CI environment.

However, you can also run the script locally. To do so, first install [Node.js](https://nodejs.org/en/download/) and the [Yarn package manager](https://yarnpkg.com/lang/en/docs/install/). In the repository folder, run `yarn` to grab all necessary dependencies.  
This will automatically install a *pre-commit hook*: Whenever you commit your changes, the testing script will automatically run and check for errors.  
To use it manually, simply run `yarn test`.

## Data formats

The company data is located in the `companies` folder. Every company (or other organization) in our database is represented by a single JSON file (named after the slug in the JSON). The JSON has to follow the schema specified in the `schema.json` file. See [below](#company-records) for more details.

If a company requires a special template for requests under the GDPR, these can be stored in the `templates` folder and referenced by their filename in the company JSON record.

<details>
<summary>The <code>suggested-companies</code> are deprecated and will be removed soon.</summary>
The <code>suggested-companies</code> folder contains suggestions on which companies users should send access requests to. It is grouped by country (where each country is represented by a file with the ISO 3166-1 alpha-2 country code as the filename). The list should only contain companies that the user should definitely request because they are relevant to pretty much every citizen of that country (e.g. collection agencies and credit agencies). It should not contain companies that are relevant for many but not all users (like Amazon, Facebook etc.)  
A list for a country is represented by a JSON array of the slugs representing the corresponding companies.
</details>

The `company-packs` folder contains bundles of related companies that are relevant to many users, grouped by country. See [below](#company-packs) for more details.

Finally, the `supervisory-authorities` folder contains data on supervisory data protection authorities. They are structured similarly to the company records, following the schema in the `schema-supervisory-authorities.json` file.

All JSON files must end with exactly one newline. All string fields in records must be trimmed (i.e. not have any leading or trailing whitespace).
Only use regular ASCII spaces, no non-breaking spaces and the like.

## Company records

### Companies we are interested in

We are only interested in [companies that the GDPR applies to](https://www.datarequests.org/blog/gdpr-territorial-scope/). In practice, that means that the company either has to have an establishment in an EU country or the company has to deliberately process the data of people in the EU.

### Data sources

We prefer privacy-specific contact details (usually found in a company's privacy policy). In particular, email addresses like `privacy@example.com` or `dpo@example.org` and phone/fax numbers specifically of data protection officers are preferred. If no specific details are available, we use 'regular' contact details found on the company's website.

Records can contain personal data (like an email address that includes a person's name) if necessary. Please review the guidelines in [#1287](https://github.com/datenanfragen/data/issues/1287) beforehand.

Some companies don't publish adequate contact information on their website. In these cases, you can resort to third-party sources but do check the information very thoroughly depending on the source.

* For US companies that are Privacy Shield certified, the [Privacy Shield List](https://www.privacyshield.gov/list) is a valuable resource for uncovering missing contact information.
* Companies in the UK have their information listed in the [Companies House Search Register](https://beta.companieshouse.gov.uk/).
* German companies are required by law to publish an 'Impressum' with their contact information. In addition to that, registered companies have to be listed in the [Handelsregister](https://www.handelsregister.de). This is a paid service but some information can be accessed for free.
* Companies in Singapore are assigned a unique entity number (UEN) and can be researched via the [Business Filing Portal of ACRA (BizFile)](https://www.bizfile.gov.sg).

### Slugs

Each company record is assigned a `slug`, which is a lowercase alphanumeric URL-friendly identifier for the record that is used in links to it.

Slugs are expected to be permanent and [never change](https://www.w3.org/Provider/Style/URI). This applies even if the name on the record later changes e.g. because the company was acquired or rebranded. For example, the tracker BounceX was given the slug `bouncex` when we added its record. It later renamed to Wunderkind but the slug stays the same.  
In the past, we have unfortunately not been entirely consistent with this policy. For these legacy cases, we have set up redirects using the [mechanism for obsolete records](#obsolete-records). In the future, slug changes may only be made in very exceptional cases, e.g. if we receive a valid legal demand.

We don't have a strict naming scheme for slugs, but they should be short and descriptive. We commonly use a [slugified](https://github.com/sindresorhus/slugify) version of the company/service name or the main website domain as the slug. If the record is only relevant for a specific country and other records for the same company exist (or may exist in the future) for other countries, the slug should be suffixed with a hyphen and the ISO 3166-1 alpha-2 country code (e.g. `mcdonalds-de` and `mcdonalds-at`).  
Often, there will be multiple reasonable options for a record's slug. In these cases, you can pick the one that seems best to you.

### Addresses

We want the addresses to be formatted consistently, so don't just copy the information directly from the company's website. Try to format the address according to the standards of the respective country. For many countries, we already have records with examples on how to format the addresses. Otherwise, the Universal Postal Union has [resources](http://www.upu.int/en/activities/addressing/postal-addressing-systems-in-member-countries.html) on how to properly format addresses for many countries. In addition, there is a very [comprehensive guide](https://www.bitboost.com/ref/international-address-formats.html) offered by BitBoost Systems.  
Delimit the individual lines of the address by newlines and make sure that each line is trimmed. The last line of the address has to be the country, either in the country's native language or in English (we are using [this list](https://github.com/annexare/Countries/blob/master/dist/countries.csv) to determine the canonical names).

For incomplete addresses, you can use SmartyStreets' [Single Address Validation Tool](https://smartystreets.com/products/single-address).

For addresses in Hong Kong, the [Correct Addressing tool](https://www.hongkongpost.hk/correct_addressing/index.jsp?lang=en_US) offered by Hongkong Post, is very useful.

Please **don't** include lines like `Data protection officer`, `Privacy department` or similar. An 'Attn' line is always added automatically by our generator. The same applies to the company name, don't include that in the `address` field, either.

### Phone and fax numbers

We want phone and fax numbers to be in a standard international format without any other characters than numbers, the plus for the international prefix and spaces. You can use the [Phone Number Parser Demo](https://libphonenumber.appspot.com/) based on [libphonenumber](https://github.com/googlei18n/libphonenumber/) to convert phone numbers to that format. Additional spaces may be inserted to improve readability.

### Required elements

If we know from previous requests (or from a privacy policy) which identification information is needed for requests to a company, we record that under the `required-elements` key.

If `required_elements` are specified, there must be one element with type `name`. This does not have to be a real name but could also be a username or even an email address, if no other information is required.  
In addition, the `required_elements` should include some way for the company to respond to the request, be it an address, an email address, a phone number or something similar. 

### Request language

Usually, the `request-language` should not be set, except for the following cases:

* If a record specifies a `custom-*-template` that isn't at least available in English, the `request-language` must be set to the language the template is available in.
* If both of the following conditions are met, the `request-language` should be set to the language from the first condition:
    1. The company in question only addresses consumers in one language.
    2. The `relevant-countries` for the company include ones where this language is not spoken.

### Relevant countries

If 'all' is specified, no additional country should be specified, as 'all' covers all countries.

## Obsolete records

From time to time, records in our database may become obsolete or irrelevant and you may want to remove a record. This can for example happen when a company is acquired, merges, goes out of business, or if the original record was created in error. 

### Deciding whether to remove a record

Our primary goal is to ensure that users can always find the correct, current contacts for exercising their GDPR rights, even in complicated and non-obvious cases, e.g. if the website of a service goes offline but the company behind it still exists and holds on to the data. However, the purpose of our database is not to collect historical information that doesn't help users anymore in the present. Meanwhile, we also don't want to break existing links to our records, either from within our own user interface (especially the "My requests" page) or external sites.

To balance these goals, we have [decided](https://github.com/datenanfragen/data/issues/1157) on a policy on how to handle these cases. Before removing a record, you must first ask: **Is there still an entity responsible for the personal data (a "controller") that the original record was about?**

#### Cases where there is still a controller

If there is still an entity that is legally obligated to respond to GDPR requests regarding the data, regardless of whether it is the same one as before, we _do_ want to give users a way to contact them. This is most common in cases of acquisitions, mergers, or rebranding. The original data still exists, and a known company is now responsible for it. In this case, there are two options:

* If the contact details have changed and we already have a record with the new contact details, the current record should be [marked as obsolete and redirected](#handling-obsolete-records) to the new record.
* Otherwise, the existing record should usually be kept and updated with the new contact details.

In both cases, the name for the company/service that users would use to search for it should be added to the `runs` array (of the old or new record) and suffixed with `(formerly)` if necessary. You will then need to provide a source that establishes that the new entity is indeed responsible.

#### Cases where there is no controller anymore

If there is no controller for the data anymore, or if the record was a mistake, it should be [marked as obsolete](#handling-obsolete-records). This means the company has ceased to exist without a clear successor, or the record does not belong in our database.

### Handling obsolete records

To mark a record as obsolete, it has to be removed from the `companies` folder and a new minimal record has to be created in the `obsolete-records` folder. The filename and slug need to stay the same. This ensures that old links don't break and that we can provide an explanation for why the record was removed.

Obsolete records follow the schema specified in `schema-obsolete-records.json`. It contains the following properties:

* `slug`: The slug the former record had. May not be changed.
* `name`: A human-readable name to identify what the record was about. This will often just be the same name as in the original record. However, you are free to use a different name if that makes it clearer what the old record was about or why it is obsolete compared to any other records we have in the database. The requirements here are laxer than for 'proper' records.
* `reason`: An identifier for why the record was declared obsolete. Most of these should be self-explanatory. Sometimes, more than one reason may be reasonable for a given case. You may pick the one that seems best to you.

  Available reasons are:

    * `company-acquired`: The company was acquired by another company which is now the controller for the data and for which we already have a record.

      Records with this reason must always redirect to a new record.
    
      **Example**: We previously had the tracker `ligatus` in our database. They have been acquired by `outbrain`. Thus, the old record was marked obsolete with the reason `company-acquired` and redirected to the new record.
    * `company-defunct`: The company has ceased to exist and there is no successor that is responsible for the data.

      **Example**: The company behind `run-ads` was dissolved and we are not aware of any successor. Thus, the old record was marked obsolete with the reason `company-defunct` and without a redirect.
    * `company-merged`: This doesn't necessarily have to be companies merging. It could also be a brand or service.

      Records with this reason must always redirect to a new record.

      **Example**: `generali` had run `aachen-muenchener` as a separate brand with separate contact details for a while. At some point, they discontinued the brand and offer everything under the Generali brand now. Thus, the old record for `aachen-muenchener` was marked obsolete with the reason `company-merged` and redirected to the `generali` record.
    * `duplicate`: There existed multiple records for the same company or service. This doesn't always have to be due to an error on our side. It could also be a company having different contact details for different services or countries and later unifying them.

      Records with this reason must always redirect to a new record.

      **Examples**: We had accidentally created two records for the BBC (`bbc` and `bbc-gb`). `bbc-gb` was marked obsolete with the reason `duplicate` and redirected to `bbc`.

      `heroku` has been owned by `salesforce` for a long time but previously had separate contact details. At some point, Heroku started linking to the main Salesforce privacy contact details with the same contact details as the `salesforce` record. Thus, we marked the `heroku` record obsolete with the reason `duplicate` and redirected it to the `salesforce` record.
    * `gdpr-not-applicable`: The GDPR does not apply to the company or service in question and it thus does not meet our [inclusion criteria](#companies-we-are-interested-in). Either we made a mistake and the record should have never been added in the first place or the company could have ceased offering its services to people in the EU.

      **Example**: `experian-sg` was a record for the Singaporean branch of Experian. The GDPR does not apply to them so the record was created in error. Thus, it was marked obsolete with the reason `gdpr-not-applicable`.
    * `out-of-scope`: The record does not meet our [inclusion criteria](#companies-we-are-interested-in) for some other reason. It is not relevant to our users and should never have been added. This could for example be because the record was spam only added to collect backlinks and it slipped through our review process.

      **Example**: We learned that the address we previously listed in the `habbocity` record was for Habbo, whereas HabboCity is an unaffiliated project. Since we were not able to find the actual address for HabboCity but all of our records need to have an address listed, we marked the record obsolete with the reason `out-of-scope`.
* `redirect-to`: The slug of another record to which old links to this record should redirect.
* `sources`: A list of sources for the record. From those, it should be apparent why the record is obsolete. For example, for a defunct company, this could be a link to the company register for its deletion. For a company that has been bought by another, it could be a link to a press release announcing the acquisition. For records that were deleted for internal reasons, this can also just be a link to a PR or issue documenting the change.

  Do not keep the sources of the original record, which often will be broken anyway.
* `quality`: Mark the record as `obsolete` to make it easily distinguishable from active records.

If you are using VS Code, you can use the `obsolete` snippet to quickly create obsolete records.

## Company packs

The company packs are bundles of related companies that hold data on many people in a certain country, with the goal of making it easier for users to send requests to them. They supersede our previous lists of suggested companies.

For each supported country, there is a JSON file of the packs in the `company-packs` folder, named after the ISO 3166-1 alpha-2 country code. Additionally, company packs that are relevant for users in all countries are in the `all.json` file.  
The JSON files follow the schema specified in `schema-company-packs.json`. They are an array of the company packs.

Each company pack has a `slug`, a `type` (where `add-all` means that all companies in the pack are relevant to the vast majority of users and they should all be immediately added, and `choose` means that it is likely that some companies are not relevant to all users and users should choose which companies they want to add), and finally `companies`, a JSON array of the slugs of the included companies.

One company can appear in multiple packs. Per-country packs are merged with an `all` pack with the same slug, if it exists. 

As being listed in a pack can have an effect on the number of requests a company receives, we need to be especially mindful here and only add companies that provably fit the pack and hold data on many people. For that reason, commits that change a pack must include sufficient documentation and sources in the commit message. Each source must have an archived link, preferably from archive.org. A single commit may only change a single pack.
