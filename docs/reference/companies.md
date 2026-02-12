# Company records

This document is meant to serve as a reference guide for our company database. The rules laid down here apply in addition to the [general policies](../policy/README.md). While certainly useful, you don't need to read this whole document in order to start contributing. Understand it more as a reference that you should consult when you are working on a record and things are unclear. It follows the structure of company records.

We do recommend reading at least to following policies:

* [Purpose](./purpose.md)
* [Scope](./scope.md)
* [Verifiability](./verifiability.md)
* [Identifying the right contact details](./contact-details.md)
* [Personal data in company records](./personal-data.md)
* [Separate or combined records](./separate-records.md)

## Slug

Each company record is assigned a `slug`, which is a lowercase alphanumeric URL-friendly identifier for the record that is used in links to it. The slug also defines the filename of the JSON file in the `companies` directory.

Slugs are expected to be permanent and [never change](https://www.w3.org/Provider/Style/URI). This applies even if the name on the record later changes, e.g. because the company was acquired or rebranded. For example, the tracker BounceX was given the slug `bouncex` when we added its record. It later renamed to Wunderkind but the slug stays the same.  
In the past, we have unfortunately not been entirely consistent with this policy. For these legacy cases, we have set up redirects using the [mechanism for obsolete records](./obsolete-records.md). In the future, slug changes may only be made in very exceptional cases, e.g. if we receive a valid legal demand.

We don't have a strict naming scheme for slugs, but they should be short and descriptive. We commonly use a [slugified](https://github.com/sindresorhus/slugify) version of the company/service name or the main website domain as the slug. If the record is only [relevant](#relevant-countries) for a specific country and other records for the same company exist (or may exist in the future) for other countries, the slug should be suffixed with a hyphen and the ISO 3166-1 alpha-2 country code (e.g. `mcdonalds-de` and `mcdonalds-at`).  
Often, there will be multiple reasonable options for a record's slug. In these cases, you can pick the one that seems best to you.

## Relevant countries

Each company record needs to lists the countries that is is relevant for. The countries can either be ISO 3166-1 alpha-2 country codes or `all`. If `all` is specified, no additional country can be specified, as `all` covers all countries.

If a company has branches in different countries with unique contact details, separate records should be created for those. If a company branch offers its services in English and isn't explicitly restricted to certain countries, `all` should be specified.

Our website implements special handling for Austria and Switzerland: When searching for companies from these country, we also show German companies. This is only a hacky workaround because we didn't properly fill out the relevant countries in the beginning. It should **not** be seen as a reason to leave out `at` and `ch` for companies that already specify `de`.

## Categories

Company records can optionally list categories that the respective company fits into. These are purposefully fairly vague and may be applied generously.

For example, we use the `school` category for anything involved in education, including universities, online course sites, professional training providers, and social media sites for students. Similarly, `church` is used for any kind of religious organization, including hospitals and kindergartens run by religious institutions.

## Name

Each company record needs to specify the respective company's or service's name. This is usually the company's official legal name, including suffixes like 'Ltd.', 'LLC', 'GmbH' etc. For exceptions, see our [policy on separate or combined records](../policy/separate-records.md#complex-company-structures).

## Runs

TODO: We need to discuss this

## Contact details

The contact details make up the most important part of the record and care has to be taken to use the right point of contact. Refer to our [policy on identifying the right contact details](../policy/contact-details.md) for that.  
Also note that sometimes we have to split up a record for one company/service into multiple ones depending on the contact details, see our [policy on separate or combined records](../policy/separate-records.md).

Records can contain personal data (like an email address that includes a person's name) **if necessary**. Please review the [personal data policy](../policy/personal-data.md) beforehand.

### Addresses

We want the addresses to be formatted consistently, so don't just copy the information directly from the company's website. Try to format the address according to the standards of the respective country. We have a [list with address formats](../policy/address-formats.md) for some countries already.

Delimit the individual lines of the address by newlines and make sure that each line is trimmed. The last line of the address has to be the country, either in the country's native language or in English (we are using [this list](https://github.com/annexare/Countries/blob/master/dist/countries.csv) to determine the canonical names). Typically, we use the native language if the company is only [relevant](#relevant-countries) in that country, and English otherwise.

For incomplete addresses, you can use Smarty's [Single Address Validation Tool](https://www.smarty.com/products/single-address).

**Don't** include 'Attn' lines like `Attn: Data protection officer`, `Privacy department`, or similar. An 'Attn' line is always added automatically by our generator. The same applies to the company name, don't include that in the `address` field, either.

### Phone and fax numbers

We want phone and fax numbers to be in a standard international format without any other characters than numbers, the plus for the international prefix, and spaces. We use [libphonenumber](https://github.com/googlei18n/libphonenumber/) to convert phone numbers to that format. You can use the [libphonenumber web interface](https://libphonenumber.appspot.com/).

### Email

Email addresses should be specified in the standard format. Remove obfuscation like `[at]` and `DOT`. If a first-party source lists an email with capitialization, we generally keep it because (while unlikely) we cannot know whether the server is configured to only accept this particular spelling.

### Webform

If available, we also list a web form where the company can be reached for GDPR requests. This should only be used for web forms specifically for GDPR requests (or ones which at least offer that as an option). General contact forms should only be entered here in rare cases, e.g. if the company has neither an email address nor a privacy-related web form.

### PGP key fingerprint and URL

Some companies provide PGP keys that can be used to send request in encrypted form. Only enter keys that work for the provided email address.

For URLs, the protocol *must* be https and the domain has to belong to the repective company.

Please check the key thoroughly before entering it.

## Website

If the company has a website, you can also list it in the record, mostly to make it clear what the record is about. Provide the full URL including the protocol (e.g. `https://`). Use the homepage of the company's main website. If we have [multiple records](../policy/separate-records.md) for companies that share a website, try to find a subpage specific to the respective company.

If the record is marked as [not safe for work](#nsfw), no website may be specified.

## Sources

Each piece of information in the record needs to come from a high-quality public source, and all those sources need to be listed in the record. We strongly prefer first-party sources, ideally the company's own privacy policy.

The listed sources should be the minimal set that covers all the information in the record. If you update a record and a previously listed source is not necessary anymore or outdated, remove it.

Refer to our [policy on verifiability](../policy/verifiability.md) for further details.

## Required elements

If we know from previous requests (or from a privacy policy) which identification information is needed for requests to a company, we record that in the record. This should be the absolute minimum the user has to specify.

If the record is only [relevant](#relevant-countries) for one country, the descriptions of the required elements can be in that country's language. Otherwise, they should be in English.

If required elements are specified, there must be one element with type `name`. This does not have to be a real name but could also be a username or even an email address, if no other information is required.  
In addition, the required elements should include some way for the company to respond to the request, be it an address, an email address, a phone number, a username (for which they have a contact on record), or something similar.

## Request language

Usually, the request language should not be set, except for the following cases:

* If a record specifies a [custom template](#custom-templates) that isn't at least available in English, the request language must be set to the language the template is available in.
* If both of the following conditions are met, the request language should be set to the language from the first condition:
    1. The company in question only addresses consumers in one language.
    2. The [relevant countries](#relevant-countries) for the company include ones where this language is not spoken.

If no request language is set, our generator will generate requests to the company in the user's set interface language.

## Custom templates

In rare cases, a company will need custom request templates. In this case, provide the name of the template without the extension.

We currently support the following custom templates:

* We use `access-tracking` for tracking companies, i.e. cases whether the user likely doesn't know how the company identifies them because they use IDs or similar. Specifying this template triggers special handling in our generator, which will then not ask the user for their identification data but instead only for contact data. As such, you may not specify [required elements](#required-elements) for companies with this template.
* We have custom templates (German only) for certain law enforcement bodies in Germany (e.g. `access-bundespolizei` and `access-lka-nds`), where the users' rights are limited by national law and we want to mention certain police databases etc.
* We also have custom templates (German only) for the catholic and protestant church in Germany, `*-katholische-kirche` and `*-evangelische-kirche`, respectively, which have their own data protection laws and don't fall under the GDPR.

If you specify a custom template that isn't available in English, make sure to seth the [request language](#request-language) field accordingly.

## Needs ID document?

If we know that an ID document is necessary for **all** requests to a company, set this to `true`. Conversely, if an ID document is *typically* not necessary, set it to `false`. 

## Suggested transport medium

Our generator suggests a transport medium that the user should use when sending requests. Given that the GDPR does not allow companies to dictate how users must send requests, this suggestion should ideally only be informed by the available contact methods and user convenience. In almost all cases, it is far more convenient for users to send an email than use any of the other transport medium. This is why, when this field is not set, our generator uses the following media in this order: `email` if the record has an email address specified, `webform` if a webform is specified, or `letter` otherwise.

You should set a suggested transport medium in the following cases:

* If the company provides an email address specifically for GDPR requests (e.g. `privacy@company.tld`), it should be set to `email`.
* If the record contains an email address but we know from experience that the company only sends automatic responses redirecting users somewhere else, it should be set to `webform` (if available) or `letter` otherwise. This decision should be documented in the PR and/or commit message.
* If the company provides neither an email address nor a webform, it should typically be set to `letter`.

## Comments

Adding comments to a record is discouraged and should not be done anymore. Record comments are not shown in the generator anymore.

If you want to add information to a record that isn't covered by any of the existing fields, please open an issue so we can discuss whether this information fits with our [scope](../policy/scope.md#information-contained-in-records) and, if so, how we can record it in a structured way.

## Quality

Each record also needs to specify its quality, based on how it was compiled. This will influence how it is displayed on the website.

The following are the allowed values (in order of descending quality):

* `tested` (someone has successfully sent a request using the details in the record)
* `verified` (a human has checked the data and confirmed it, likely by observing it on the company's website)
* `imported` (the record was acquired from an existing data set that may not specifically collect data protection contacts but was still verified by a human who is not part of the project)
* `scraped` (the record was created by a machine and has not been verified).

A `tested` records needs to have [required elements](#required-elements) set. If you update any of the [contact details](#contact-details) of a tested record, you should demote it to `verified` (unless, of course, the tested requirements have already been met for the new details).

## Facet group

Some categories of records (e.g. churches and schools) tend to have disproportionally many records in the database, which degrades the search results. The facet group is a workaround to limit the number of records returned from these records. Specify it if the record falls into one of the following groups:

* `church`
* `school`

## NSFW

To comply with youth protection rules, we need to treat adult-only companies a bit differently, e.g. we do not want to suggest them under "Related companies" on the website.

This field is to be set to `true` iff the company in question is to be considered "not safe for work", i.e. if offers content or services that fall under applicable youth protection laws. This fields mustn't be set to `false`, instead just omit it.
