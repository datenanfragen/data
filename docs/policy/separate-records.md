# Separate or combined records

The company database is not a database of controllers but of _contact details_ for sending data protection requests to companies, services, etc. (see also our [policy on identifying the right contact details](./contact-details.md)). This means that sometimes, multiple services or even companies will share a record, while in other cases, a single service may require multiple records.

## Simple cases

The majority of our records are fairly straightforward. If a company only offers a single service or acts under one brand, there should usually be one record for this company. For example:

> The social network GiveMeLikes is run by GiveMeLikes International Ltd. at Some Road 123, 12345 Some City, Some Country. The privacy policy says that requests should be directed to the controller and lists an email for them.
> 
> This is pretty much the simplest and most common case. Here, the name in the record should be `GiveMeLikes International Ltd.`, the address should be `Some Road 123\n12345 Some City\nSome Country` and the mentioned email address should be listed under `email`.

If one company runs multiple services, perhaps even at different websites, that all share the same contact details for data protection requests, they should also be combined into a single record. For example:

> The video sharing sites TokTokTokTik and Rhythmtically are run by Heaven AB at Some Road 123, 12345 Some City, Some Country. Users can contact prayer@heaven.tld for support. The privacy policy says that data protection requests should be sent to the external data protection officer DPO4You Inc. at DPO Street 456, 67890 DPO City, DPO Country or via email to requests@dpo4you.tld.
> 
> This case is also very common. Since both services are run by the same company and their contact details are also identical, we only need one record. The `name` should be `Heaven AB` and `runs` should list both `TokTokTokTik` and `Rhythmtically`.
> 
> Since data protection requests should go to the DPO, the `address` should be `c/o DPO4You Inc.\nDPO Street 456\n67890 DPO City\nDPO Country` and the `email` should be `requests@dpo4you.tld`. All other details mentioned above are not in scope for our database and should thus not be included in the record (cf. our [scope policy](./scope.md)).

## Different contact details for different countries or languages

Sometimes, companies will list different contact details for different countries or languages. This might already be obvious from looking at a single version of a privacy policy, but it is usually a good idea to also check the different versions for large companies to make sure. In these cases, we need to create separate contact details for each country/language. We will then typically suffix the slug with the country or language code.

For example:

> The messenger service Accord offers its app in many language and also has translated versions of its privacy policy. The German one mentions that requests should be sent to `datenschutz@accord.tld`. As this is clearly a localized email, we should also check other versions and notice that the French version instead mentions `donnees@accord.tld`.
> 
> Since the contact details are different for different languages, we also need to create a separate record for each language. Here, we would create `accord-de` and `accord-fr` and fill the email addresses accordingly.

## Complex company structures

As we've seen, in most cases, requests should be sent to the controller directly and this should thus be reflected in the record. But there are also cases where the controller should only be mentioned under `runs` but not under `name` and `address`.

Due to the large variety of company structures and internal processes, it's not really possible to postulate hard guidelines on this, the more complicated cases are often judgement calls. These should always be made keeping in mind the goal of the company database, deciding on how the information is most useful for users. As an example:

> The online shops BestG00ds and CheapG00ds are run by Frank's **Retail** LLC at Some Road 123, 12345 Some City, Some Country. Customer service inquires can be sent to support@bestg00ds.tld or support@cheapg00ds.tld respectively. The privacy policy says that data protection requests should be sent to Frank's **Online Empire** LLC at Some Road 125, 12345 Some City, Some Country or via email to privacy@bestg00ds.tld or privacy@cheapg00ds.tld respectively.
> 
> This case is getting more complicated. Since we now have two services that, while run by the same company, require different contact details, we need two separate records. Here, the `name`s should—as an exception—be `BestG00ds` and `CheapG00ds` (and not the legal name) such that users can distinguish the two records. The `address` should be `c/o Frank's Online Empire LLC\nSome Road 125\n12345 Some City\nSome Country` for both. The `email`s should be `privacy@bestg00ds.tld` and `privacy@cheapg00ds.tld`, respectively.
> 
> `Frank's **Retail** LLC` should be listed under `runs` for both records. Again, all other information listed above is out of scope and should not be included in the record.

## Joint controllership

Conversely to the above case, it also happens that companies are joint controllers, meaning that users can send their requests to _any_ of the respective companies (cf. Art. 26(3) GDPR). In this case, we only need one record for them. We would then usually try to determine the "main" company and list that one under `name` and the other ones under `runs`. As an exception, if the "main" company is based outside of the EU but there is also an EU company that is a joint controller, we would typically list the EU company under `name` because that is easier for people in the EU to reach.

For example:

> The payment card service Maincard is run by Maincard Inc. in the US but also has a European establishment, Maincard Europe SA in Belgium. According to the privacy policy, both companies act as joint controller. Thus, we only need a single record for Maincard. Since Maincard Europe SA is based in the EU while Maincard Inc. is based outside the EU, we would list `Maincard Europe SA` under `name` and `Maincard Inc.` under `runs`.

You need to be careful with this though. Just because different companies are mentioned in one privacy policy, it does not necessarily mean that they are joint controllers. Especially with insurance companies, it is not uncommon for many distinct companies to all appear under the same brand for end users, but for those companies to each be controllers for their own data. For example:

> The privacy policy for the insurance provider XAX explains that different companies act as controllers for different divisions. XAX S.A. is the parent holding company with email privacy@xax.tld, health insurance is provided by XAX Health Insurance S.A. with email privacy-health@xax.tld, car insurance is provided by XAX Easy Car S.A. with email privacy@xax.tld, and life insurance is provided by XAX Life Insurance S.A. with email privacy@xax.tld.
> 
> Even though some one them use the same email, they are different controllers and thus all need separate records. We would thus create the following records:
> 
> - `xax-health-insurance` with `name` as `XAX Health Insurance S.A.` and `email` as `privacy-health@xax.tld`
> - `xax-easy-car` with `name` as `XAX Easy Car S.A.` and `email` as `privacy@xax.tld`
> - `xax-life-insurance` with `name` as `XAX Life Insurance S.A.` and `email` as `privacy@xax.tld`
> 
> In this case, XAX S.A. appears to act solely as a holding company and not have any operational activities. As such, it is unlikely to fit our [inclusion criteria](./scope.md) and we would thus not create a record for it.

Similarly, just because multiple companies share the same DPO (even within the same company), it still doesn't mean that they are joint controllers. This case is even trickier because _sometimes_ they will insist on acting as separate controllers (and thus require users to send individual requests to each one), while other times, the DPO will just answer for all companies anyway. Since it is often not possible for us to know which is the case, we create separate records when in doubt. If you are sure that having a single record is appropriate, document the reasoning behind this in the commit message.
