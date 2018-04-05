# Company data for datenanfragen.de

This repository contains contact and privacy information for companies that fall under the scope of the EU GDPR.  
It is used to power the datenanfragen.de company database but we warmly welcome you to use the data for your own projects!

## Contributing

Due to the nature of the data we are collecting here, frequent changes, additions and deletions will be necessary. We invite you contribute whatever information you have. Currently, please just submit pull requests in order to do so. You can use [this tool](https://company-json.netlify.com/) to generate valid JSON records.
We are working on easier ways to help you contribute.

Please be aware that by contributing, you agree for your work to be released under a Creative Commons CC0 1.0 Universal license, as specified in the `LICENSE` file.

## Data formats

The core data is located in the `data` folder. Every company (or other organization) in our database is represented by a single JSON file (named after the slug in the JSON). The JSON has to follow the schema specified in the `schema.json` file.

If a company requires a special template for requests under the GDPR, these can be stored in the `templates` folder and referenced by their filename in the company JSON record.

## Data format guidelines and resources

### Address

We want the addresses to formatted consistently, so don't just copy the information directy from the company's website. Try to format the address according to the standards of the respective country. The Universial Postal Union has [resources](http://www.upu.int/en/activities/addressing/postal-addressing-systems-in-member-countries.html) on how to properly format addresses for many countries. In addition, there is a very [comprehensive guide](https://www.bitboost.com/ref/international-address-formats.html) offered by BitBoost Systems.

For incomplete addresses, you can use SmartyStreets' [Single Address Validation Tool](https://smartystreets.com/products/single-address).

### Phone and fax numbers

We want phone and fax numbers to be in a standard international format without any other characters than numbers, the plus for the international prefix and spaces. You can use the [Phone Number Parser Demo](https://libphonenumber.appspot.com/) based on [libphonenumber](https://github.com/googlei18n/libphonenumber/) to convert phone numbers to that format. Additional spaces may be inserted to improve readability.