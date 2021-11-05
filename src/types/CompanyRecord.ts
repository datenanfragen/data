/**
 * A single record of the Datenanfragen.de company database. It represents the contact
 * information of a company (or other organization) specifically for privacy-related
 * inquires and requests.
 * More information and access to the whole database at:
 * https://github.com/datenanfragen/companies
 */
export interface CompanyRecord {
    /**
     * The address where the company can be reached for privacy-related inquires and requests.
     * Has to include the country (either in the country's native language or in English) in the
     * last line and should be formatted according to the standards of the respective country.
     */
    address: string;
    /**
     * A list of categories that the company fits into. These are purposefully fairly vague and
     * may be applied generously.
     */
    categories?: Category[];
    /**
     * A list of notes relevant to the record.
     */
    comments?: string[];
    /**
     * The path to a custom template for data access requests to this company, if necessary.
     */
    "custom-access-template"?: string;
    /**
     * The path to a custom template for data erasure requests to this company, if necessary.
     */
    "custom-erasure-template"?: string;
    /**
     * The path to a custom template for direct marketing objection requests to this company, if
     * necessary.
     */
    "custom-objection-template"?: string;
    /**
     * The path to a custom template for data rectification requests to this company, if
     * necessary.
     */
    "custom-rectification-template"?: string;
    /**
     * An email address where the company can be reached for privacy-related inquires and
     * requests. Preferably a specific privacy@[domain.tld] address if available.
     */
    email?: string;
    /**
     * If the record falls into one of the listed groups, choose that one. Otherwise, leave this
     * field blank. This allows us to limit the amount of records of which there are many
     * (churches, schools, etc.) returned in searches.
     */
    "facet-group"?: FacetGroup;
    /**
     * A fax number where the company can be reached for privacy-related inquires and requests.
     * Has to be in the standard international format and include the country code.
     */
    fax?: string;
    /**
     * The company's official name, including suffixes like 'Ltd.', 'LLC', 'GmbH' etc.
     */
    name: string;
    /**
     * Whether an ID document is necessary for all requests to this company. Only to be set to
     * `true` if an ID document is confirmed to be required in all circumstances. Default is
     * `false`.
     */
    "needs-id-document"?: boolean;
    /**
     * Fingerprint of the PGP key of the email address used to send privacy-related inquires and
     * requests to the company. The PGP key should be found by this key on public keyservers.
     * Please check the key thoroughly before entering it.
     */
    "pgp-fingerprint"?: string;
    /**
     * URL, where the PGP key of the email address used to send privacy-related inquires and
     * requests to the company can be downloaded. The protocol *must* be https and the domain
     * has to belong to the repective authority. Please check the key thoroughly before entering
     * it.
     */
    "pgp-url"?: string;
    /**
     * A phone number where the company can be reached for privacy-related inquires and
     * requests. Has to be in the standard international format and include the country code.
     */
    phone?: string;
    /**
     * The quality of the record based on how it was compiled. The following are the allowed
     * values (in order of descending quality): 'tested' (someone has successfully sent a
     * request using the details in the record), 'verified' (a human has checked the data and
     * confirmed it, likely by observing it on the company's website), 'imported' (the record
     * was acquired from an existing data set that may not specifically collect privacy contacts
     * but was still verified by a human who is not part of the project), 'scraped' (the record
     * was created by a machine and has not been verified).
     */
    quality: Quality;
    /**
     * A list of countries the record is relevant for. The countries can either be an ISO 3166-1
     * alpha-2 country code or 'all'. If a company has branches in different countries with
     * unique contact data, separate records should be created for those. If a company branch
     * offers its services in English and isn't explicitly restricted to certain countries,
     * 'all' should be specified.
     */
    "relevant-countries": RelevantCountry[];
    /**
     * The language requests to the company (or specifically its branch as specified in the
     * respective record) should be in. Has to be an ISO 639-1 language code. If not specified,
     * fallback to the interface language.
     */
    "request-language"?: string;
    /**
     * A list of identification elements the user has to provide for requests to the company.
     * Only to be filled in if they have been confirmed. This should be the absolute minimum the
     * user has to specify.
     */
    "required-elements"?: RequiredElement[];
    /**
     * A list of other services and companies the parent company is responsible (as defined in
     * Article 4(7) GDPR) for.
     */
    runs?: string[];
    /**
     * A unique identifier for the company record. Also defines the filename.
     */
    slug: string;
    /**
     * A list of sources for the record. Preferably from the company's official website.
     */
    sources: string[];
    /**
     * The transport medium a user should use for their privacy-related inquires and requests.
     * If a specific privacy@[domain.tld] email address is available, 'email' should be
     * specified. If no value is specified, the default is 'email' if the record has an email
     * address specified or 'letter' otherwise.
     */
    "suggested-transport-medium"?: SuggestedTransportMedium;
    /**
     * The company's main website. Include the protocol, e.g. `https://`.
     */
    web?: string;
}

export enum Category {
    Addresses = "addresses",
    Ads = "ads",
    Church = "church",
    CollectionAgency = "collection agency",
    Commerce = "commerce",
    CreditAgency = "credit agency",
    Entertainment = "entertainment",
    Finance = "finance",
    Health = "health",
    Insurance = "insurance",
    Nonprofit = "nonprofit",
    PoliticalParty = "political party",
    PublicBody = "public body",
    School = "school",
    SocialMedia = "social media",
    Telecommunication = "telecommunication",
    Travel = "travel",
    Utility = "utility",
}

/**
 * If the record falls into one of the listed groups, choose that one. Otherwise, leave this
 * field blank. This allows us to limit the amount of records of which there are many
 * (churches, schools, etc.) returned in searches.
 */
export enum FacetGroup {
    Church = "church",
    School = "school",
}

/**
 * The quality of the record based on how it was compiled. The following are the allowed
 * values (in order of descending quality): 'tested' (someone has successfully sent a
 * request using the details in the record), 'verified' (a human has checked the data and
 * confirmed it, likely by observing it on the company's website), 'imported' (the record
 * was acquired from an existing data set that may not specifically collect privacy contacts
 * but was still verified by a human who is not part of the project), 'scraped' (the record
 * was created by a machine and has not been verified).
 */
export enum Quality {
    Imported = "imported",
    Scraped = "scraped",
    Tested = "tested",
    Verified = "verified",
}

export enum RelevantCountry {
    All = "all",
    At = "at",
    Be = "be",
    Bg = "bg",
    Ch = "ch",
    Cy = "cy",
    Cz = "cz",
    De = "de",
    Dk = "dk",
    Ee = "ee",
    Es = "es",
    Fi = "fi",
    Fr = "fr",
    Gb = "gb",
    Gr = "gr",
    Hr = "hr",
    Hu = "hu",
    Ie = "ie",
    Is = "is",
    It = "it",
    Li = "li",
    Lt = "lt",
    Lu = "lu",
    Lv = "lv",
    Mt = "mt",
    Nl = "nl",
    No = "no",
    Pl = "pl",
    Pt = "pt",
    Ro = "ro",
    Se = "se",
    Si = "si",
    Sk = "sk",
}

export interface RequiredElement {
    /**
     * A clear description of the identification element.
     */
    desc: string;
    /**
     * Whether the identification element is optional. Default is `false`.
     */
    optional?: boolean;
    /**
     * The type of identification element.
     */
    type: Type;
}

/**
 * The type of identification element.
 */
export enum Type {
    Address = "address",
    Birthdate = "birthdate",
    Email = "email",
    Input = "input",
    Name = "name",
    Textarea = "textarea",
}

/**
 * The transport medium a user should use for their privacy-related inquires and requests.
 * If a specific privacy@[domain.tld] email address is available, 'email' should be
 * specified. If no value is specified, the default is 'email' if the record has an email
 * address specified or 'letter' otherwise.
 */
export enum SuggestedTransportMedium {
    Email = "email",
    Fax = "fax",
    Letter = "letter",
}
