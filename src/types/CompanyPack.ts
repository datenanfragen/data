/**
 * A bundle of related companies that hold data on many people, to make it easier for users
 * to send requests to them.
 * More information and access to the whole database at:
 * https://github.com/datenanfragen/data
 */
export interface CompanyPack {
    /**
     * A list of the slugs of the companies in the pack.
     */
    companies: string[];
    /**
     * A unique identifier for the company pack.
     */
    slug: string;
    /**
     * Whether all companies in this pack are relevant to the vast majority of users and should
     * be always be added (`add-all`), or the user should be presented with a choice of which
     * companies to add (`choose`).
     */
    type: Type;
}

/**
 * Whether all companies in this pack are relevant to the vast majority of users and should
 * be always be added (`add-all`), or the user should be presented with a choice of which
 * companies to add (`choose`).
 */
export enum Type {
    AddAll = "add-all",
    Choose = "choose",
}
