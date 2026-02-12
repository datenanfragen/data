# Scope

In line with the [purpose](./purpose.md) of our company database, we have limited the companies and information we accept in it.

## Inclusion criteria

We only accept company records that fit the following criteria:

* **applicable**: We are only interested in [companies that the GDPR applies to](https://www.datarequests.org/blog/gdpr-territorial-scope/). In practice, that means that the company either needs to have an establishment in an EU country or the company has to deliberately process the data of people in the EU.
* **relevant**: We need to make sure to keep the records in our company database up-to-date, which means that every new one creates an additional maintenance burden. Since our database is only maintained by a small team of volunteers, we have to prioritize those companies that are relevant for the most users. In practice, this means that only companies that regularly process personal data of significant numbers of individuals are in scope.

  Here are some examples of companies that don't meet our relevance criterion:
  
  * We usually don't accept companies that only process data of a very limited number of individuals. This is a fairly weak criterion and there is no hard threshold on how many people need to be affected. You should also keep in mind the context of the data processing when assessing this criterion. For example, a local bakery that offers a newsletter on their website would typically not be in scope. Neither would a small indie game that requires users to register in order to play.
  
    One notable exception to this criterion are public bodies, including schools, which will typically be in scope. For example, a small city's tax authority might well process data on fewer people than the indie game, but the data they process is much more severe. There is also typically only one tax authority responsible for a given region, so it doesn't make sense to prioritize "larger" tax authorities.
  * Companies that only target B2B customers are not in scope, unless they also process personal data about a significant number of individuals, for example because they have tens of thousands of employees.
  * Similarly, companies that typically act as processors for other companies and are only controllers for their own (business) customers and employees are typically not relevant.

    One notable exception from this criterion are tracking companies. For one, many will reply to users' requests even if they are processors (and in this case provide a much for viable path for users to access their rights compared to going through individual sites/apps). Additionally, it is often hard to tell whether they are actually exclusively processors or whether they also use the data for their own purposes and thus become joint controllers.
* **sourced**: We can only include companies whose details we can verify using high-quality public sources (see also our [policy on verifiability](./verifiability.md)). We need to at the very least know the company's name and address (sending requests as a letter is the fallback that always needs to work on our website).
* **current**: We do not collect historical information that doesn't help users anymore in the present. As such, we don't add records for companies that don't exist anymore. For cases where a company already in our database is acquired, merges, or goes out of business later, check our [guidelines for obsolete records](../reference/obsolete-records.md).

It sometimes happens that a company stops meeting the criteria after it has already been added to the database, or we may have erroneously added a company that does not meet the criteria. For these cases, we have a mechanism of [obsolete records](../reference/obsolete-records.md) to remove them without breaking existing links.

## Information contained in records

The goal of the company database is not to collect all available data on a company, or even all data related to data protection practices of the company. Our goal is only to tell users where they should send requests to a company. We thus only collect the preferred/suggested way to contact them for such purposes through each medium.

If, for example, there multiple email addresses listed in the privacy policy, we only include the most appropriate one in the record. Such considerations can and should be documented in the PR, but should not be included in the record. If we later learn that another email address is better, we update the record.

Similarly to the inclusion criteria for records, we don't collect historical information in the records, either. Information that is outdated and contact details that don't work anymore must be removed.
