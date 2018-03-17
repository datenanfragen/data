# Company data for datenanfragen.de

This repository contains contact and privacy information for companies that fall under the scope of the EU GDPR.  
It is used to power the datenanfragen.de company database but we warmly welcome you to use the data for your own projects!

## Contributing

Due to the nature of the data we are collecting here, frequent changes, additions and deletions will be necessary. We invite you contribute whatever information you have. Currently, please just submit pull requests in order to do so. We are working on other ways to help you contribute.

Please be aware that by contributing, you agree for your work to be released under a Creative Commons CC0 1.0 Universal license, as specified in the `LICENSE` file.

## Data formats

The core data is located in the `data` folder. Every company (or other organization) in our database is represented by a single JSON file (named after the slug in the JSON). The JSON has to follow the schema as specified in the `schema.json` file.

If a company requires a special template for requests under the GDPR, these can be stored in the `templates` folder and referenced by their filename in the company JSON record.