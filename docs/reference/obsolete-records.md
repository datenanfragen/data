# Obsolete records

From time to time, records in our database may become obsolete or irrelevant and you may want to remove a record. This can for example happen when a company is acquired, merges, goes out of business, or if the original record was created in error. 

## Deciding whether to remove a record

Our primary goal is to ensure that users can always find the correct, current contacts for exercising their GDPR rights, even in complicated and non-obvious cases, e.g. if the website of a service goes offline but the company behind it still exists and holds on to the data. However, the [purpose of our database](../policy/purpose.md) is [not to collect historical information](../policy/scope.md) that doesn't help users anymore in the present. Meanwhile, we also don't want to break existing links to our records, either from within our own user interface (especially the "My requests" page) or external sites.

To balance these goals, before removing a record, you must first ask: **Is there still an entity responsible for the personal data (a "controller") that the original record was about?**

### Cases where there is still a controller

If there is still an entity that is legally obligated to respond to GDPR requests regarding the data, regardless of whether it is the same one as before, we _do_ want to give users a way to contact them. This is most common in cases of acquisitions, mergers, or rebranding. The original data still exists, and a known company is now responsible for it. In this case, there are two options:

* If the contact details have changed and we already have a record with the new contact details, the current record should be [marked as obsolete and redirected](#handling-obsolete-records) to the new record.
* Otherwise, the existing record should usually be kept and updated with the new contact details.

In both cases, the name for the company/service that users would use to search for it should be added to the `runs` array (of the old or new record) and suffixed with `(formerly)` if necessary. You will then need to provide a source that establishes that the new entity is indeed responsible.

### Cases where there is no controller anymore

If there is no controller for the data anymore, or if the record was a mistake, it should be [marked as obsolete](#handling-obsolete-records). This means the company has ceased to exist without a clear successor, or the record does not belong in our database.

## Handling obsolete records

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
    * `gdpr-not-applicable`: The GDPR does not apply to the company or service in question and it thus does not meet our [inclusion criteria](../policy/scope.md). Either we made a mistake and the record should have never been added in the first place or the company could have ceased offering its services to people in the EU.

      **Example**: `experian-sg` was a record for the Singaporean branch of Experian. The GDPR does not apply to them so the record was created in error. Thus, it was marked obsolete with the reason `gdpr-not-applicable`.
    * `out-of-scope`: The record does not meet our [inclusion criteria](../policy/scope.md) for some other reason. It is not relevant to our users and should never have been added. This could for example be because the record was spam only added to collect backlinks and it slipped through our review process.

      **Example**: We learned that the address we previously listed in the `habbocity` record was for Habbo, whereas HabboCity is an unaffiliated project. Since we were not able to find the actual address for HabboCity but all of our records need to have an address listed, we marked the record obsolete with the reason `out-of-scope`.
* `redirect-to`: The slug of another record to which old links to this record should redirect.
* `sources`: A list of sources for the record. From those, it should be apparent why the record is obsolete. For example, for a defunct company, this could be a link to the company register for its deletion. For a company that has been bought by another, it could be a link to a press release announcing the acquisition. For records that were deleted for internal reasons, this can also just be a link to a PR or issue documenting the change.

  Do not keep the sources of the original record, which often will be broken anyway.
* `quality`: Mark the record as `obsolete` to make it easily distinguishable from active records.

If you are using VS Code, you can use the `obsolete` snippet to quickly create obsolete records.
