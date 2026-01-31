/**
 * A former record in the Datenanfragen.de company database that is now obsolete.
 * It thus only holds minimal information so as not to break existing links etc.
 */
export interface ObsoleteRecord {
    /**
     * A human-readable name to identify what the record was about. This doesn't need to be the
     * company's legal name, but could for example also be the name of a service it offered that
     * the former record was about.
     */
    name: string;
    /**
     * Mark the record as obsolete to make it easily distinguishable from active records.
     */
    quality: Quality;
    /**
     * The reason why the record is obsolete.
     */
    reason: ReasonForObsolescence;
    /**
     * The slug of another record to which old links to this record should redirect, e.g. the
     * record of the acquiring company.
     */
    "redirect-to"?: string;
    /**
     * The slug the former record had. May not be changed.
     */
    slug: string;
    /**
     * A list of sources for the record. From those, it should be apparent why the record is
     * obsolete. For example, for a defunct company, this could be a link to the company
     * register for its deletion. For a company that has been bought by another, it could be a
     * link to a press release announcing the acquisition. For records that were deleted for
     * internal reasons, this can also just be a link to a PR or issue documenting the change.
     * Do not keep the sources of the original record, which often will be broken anyway.
     */
    sources: string[];
}

/**
 * Mark the record as obsolete to make it easily distinguishable from active records.
 */
export enum Quality {
    Obsolete = "obsolete",
}

/**
 * The reason why the record is obsolete.
 */
export enum ReasonForObsolescence {
    CompanyAcquired = "company-acquired",
    CompanyDefunct = "company-defunct",
    CompanyMerged = "company-merged",
    Duplicate = "duplicate",
    GdprNotApplicable = "gdpr-not-applicable",
    OutOfScope = "out-of-scope",
}
