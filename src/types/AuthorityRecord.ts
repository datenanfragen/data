/**
 * A single record of the Datenanfragen.de supervisory authority database. It represents the
 * contact information of an authority specifically for lodging complaints.
 * More information and access to the whole database at:
 * https://github.com/datenanfragen/companies
 */
export interface AuthorityRecord {
    /**
     * The address where the authority can be reached to lodge complaints. Has to include the
     * country (either in the country's native language or in English) in the last line and
     * should be formatted according to the standards of the respective country.
     */
    address: string;
    /**
     * A list of notes relevant to the record.
     */
    comments?: string[];
    /**
     * The language complaint to the authority should be in. Has to be an ISO 639-1 language
     * code. If not specified, fallback to the interface language.
     */
    "complaint-language"?: string;
    /**
     * An email address where the authority can be reached to lodge complaints. Preferably a
     * specific complaint@[domain.tld] address if available.
     */
    email?: string;
    /**
     * A fax number where the authority can be reached for privacy-related inquires and
     * complaints. Has to be in the standard international format and include the country code.
     */
    fax?: string;
    /**
     * The official name of the authority.
     */
    name: string;
    /**
     * Fingerprint of the PGP key of the email address used to lodge complaints with the
     * authority. The PGP key should be found by this key on public keyservers. Please check the
     * key thoroughly before entering it.
     */
    "pgp-fingerprint"?: string;
    /**
     * URL, where the PGP key of the email address used to lodge complaints with the authority
     * can be downloaded. The protocol *must* be https and the domain has to belong to the
     * repective authority. Please check the key thoroughly before entering it.
     */
    "pgp-url"?: string;
    /**
     * A phone number where the authority can be reached for privacy-related inquires and
     * complaints. Has to be in the standard international format and include the country code.
     */
    phone?: string;
    /**
     * A list of countries the record is relevant for. The countries can either be an ISO 3166-1
     * alpha-2 country code or 'all'. If a supervisory authority offers its services in English
     * and isn't explicitly restricted to certain countries, 'all' should be specified.
     */
    "relevant-countries": string[];
    /**
     * A unique identifier for the supervisory authority record. Also defines the filename.
     */
    slug: string;
    /**
     * A list of sources for the record. Preferably from the authority's official website.
     */
    sources: string[];
    /**
     * The transport medium a user should use for their privacy-related inquires and requests.
     * If a PGP key is available, 'email' should be specified. The default is a fallback chain
     * as follows: fax -> letter -> email.
     */
    "suggested-transport-medium"?: SuggestedTransportMedium;
    /**
     * The authority's main website.
     */
    web?: string;
}

/**
 * The transport medium a user should use for their privacy-related inquires and requests.
 * If a PGP key is available, 'email' should be specified. The default is a fallback chain
 * as follows: fax -> letter -> email.
 */
export enum SuggestedTransportMedium {
    Email = "email",
    Fax = "fax",
    Letter = "letter",
}
