# Company data for Datenanfragen.de

This repository contains a directory of contact information and privacy-related data on companies (and other organizations) under the scope of the EU GDPR, a directory of supervisory authorities for privacy concerns, a collection of templates for GDPR requests and a list of suggested companies to send access requests to.  
It is used to power the Datenanfragen.de company database but we warmly welcome you to use the data for your own projects!

## Contributing

Due to the nature of the data we are collecting here, frequent changes, additions and deletions will be necessary. We invite you to contribute whatever information you have. Currently, please just submit pull requests in order to do so. You can use [this tool](https://company-json.netlify.com/) to generate valid JSON records.  
We are working on easier ways to help you contribute.

Please be aware that by contributing, you agree for your work to be released under a Creative Commons CC0 1.0 Universal license, as specified in the `LICENSE` file.

## Data formats

The company data is located in the `companies` folder. Every company (or other organization) in our database is represented by a single JSON file (named after the slug in the JSON). The JSON has to follow the schema specified in the `schema.json` file.

If a company requires a special template for requests under the GDPR, these can be stored in the `templates` folder and referenced by their filename in the company JSON record.

The `suggested-companies` folder contains suggestions on which companies users should send access requests to. It is grouped by country (where each country is represented by a file with the ISO 3166-1 alpha-2 country code as the filename). The list should only contain companies that the user should definitely request because they are relevant to pretty much every citizen of that country (e.g. collection agencies and credit agencies). It should not contain companies that are relevant for many but not all users (like Amazon, Facebook etc.)  
A list for a country is represented by a JSON array of the slugs representing the corresponding companies.

Finally, the `supervisory-authorities` folder contains data on supervisory data protection authorities. They are structured similarly to the company records, following the schema in the `schema-supervisory-authorities.json` file.

## Data format guidelines and resources (for company records)

### Data sources

We prefer privacy-specific contact details (usually found in a company's privacy policy). In particular, email addresses like `privacy@example.com` or `dpo@example.org` and phone/fax numbers specifically of data protection officers are preferred. If no specific details are available, we use 'regular' contact details found on the company's website.

Please make sure that there is **no** personal data in your record. This means no names in the address and no emails that include names, either.

Some companies don't publish adequate contact information on their website. In these cases, you can resort to third-party sources but do check the information very thoroughly depending on the source.

* For US companies that are Privacy Shield certified, the [Privacy Shield List](https://www.privacyshield.gov/list) is a valuable resource for uncovering missing contact information.
* Companies in the UK have their information listed in the [Companies House Search Register](https://beta.companieshouse.gov.uk/).
* German companies are required by law to publish an 'Impressum' with their contact information. In addition to that, registered companies have to be listed in the [Handelsregister](https://www.handelsregister.de). This is a paid service but some information can be accessed for free.
* Companies in Singapore are assigned a unique entity number (UEN) and can be be researched via the [Business Filing Portal of ACRA (BizFile)](https://www.bizfile.gov.sg).

### Addresses

We want the addresses to be formatted consistently, so don't just copy the information directy from the company's website. Try to format the address according to the standards of the respective country. For many countries, we already have records with examples on how to format the addresses. Otherwise, the Universal Postal Union has [resources](http://www.upu.int/en/activities/addressing/postal-addressing-systems-in-member-countries.html) on how to properly format addresses for many countries. In addition, there is a very [comprehensive guide](https://www.bitboost.com/ref/international-address-formats.html) offered by BitBoost Systems.

For incomplete addresses, you can use SmartyStreets' [Single Address Validation Tool](https://smartystreets.com/products/single-address).

For addresses in Hong Kong, the [Correct Addressing tool](https://www.hongkongpost.hk/correct_addressing/index.jsp?lang=en_US) offered by Hongkong Post, is very useful.

Please **don't** include lines like `Data protection officer`, `Privacy department` or similar. They will be automatically added by our generator, anyway. Also, **don't** include any personal data (like names) in the address.

### Phone and fax numbers

We want phone and fax numbers to be in a standard international format without any other characters than numbers, the plus for the international prefix and spaces. You can use the [Phone Number Parser Demo](https://libphonenumber.appspot.com/) based on [libphonenumber](https://github.com/googlei18n/libphonenumber/) to convert phone numbers to that format. Additional spaces may be inserted to improve readability.

## Required elements

If we know from previous requests (or from a privacy policy) which identification information is needed for requests to a company, we record that under the `required-elements` key.

If `required_elements` are specified, there *should* be one element with type `name`. This does not have to be a real name but could also be a username or even an email address, if no other information is required.  
In addition, the `required_elements` should include some way for the company to respond to the request, be it an address, an email address, a phone number or something similar. 
