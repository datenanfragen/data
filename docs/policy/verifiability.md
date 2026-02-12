# Verifiability

As per our [inclusion criteria](./scope.md#inclusion-criteria), all information in our records need to be well-sourced and verifiable. They cannot contain original research. Every piece of information in the record needs to have a high-quality and publicly available source, preferably first-party. All sources need to be available online and linked in the record.

Sources should be the minimal set that covers all information in the record, preferring the company's own privacy policy over other types of sources. Outdated sources should be removed.

## Third-party sources

Sometimes, a company will not provide their address or other contact details on their own website. In these cases, you can resort to third-party sources but do check the source and information very thoroughly. We prefer official sources like company registers. Here are some examples of company registers by country:

* France: [Infogreffe](https://www.infogreffe.fr/)
* Netherlands: [KVK Company Register](https://www.kvk.nl/en/search/) (actual company reports are paid, but the order pages contain the name and address, and are linkable)
* Switzerland
  * [Canton of St. Gallen Commercial Register](https://sg.chregister.ch/cr-portal/suche/suche.xhtml)
* United Kingdom
  * [Companies House Register](https://find-and-update.company-information.service.gov.uk/)
  * [ICO Register of Fee Payers](https://ico.org.uk/ESDWebPages/Search)
* United States (by state)
  * Georgia: [Georgia Corporations Division Business Search](https://ecorp.sos.ga.gov/BusinessSearch)
  * Kentucky: [Kentucky Secretary of State Business Entity Search](https://sosbes.sos.ky.gov/BusSearchNProfile/search.aspx)
  * Washington: [Washington Corporations and Charities Filing System](https://ccfs.sos.wa.gov/#/AdvancedSearch) (no permalinks advertised, but can be constructed: `https://ccfs.sos.wa.gov/#/BusinessSearch/BusinessInformation?ubi=<UBI number>`)
  * Wyoming: [Wyoming Secretary of State Business Center](https://wyobiz.wyo.gov/Business/FilingSearch.aspx)

The official sites for some countries' company registers, like the German Handelsregister, unfortunately don't have stable links (or provide a way to link to specific pages at all). They can thus not be used as sources. In these cases, you can fall back to third-party services that archive such data. We preferably use the following:

* [North Data](https://www.northdata.com/) covers mostly European countries, has very comprehensive data, and data is frequently updated
* [OpenCorporates](https://opencorporates.com/) covers more countries worldwide but data is often less complete and not updated as frequently

If you use a company register or third-party service as a source, it's preferred to link to overview pages rather than individual change notices. This way, we can catch future changes automatically.

## Automatic verification

We employ some automatic verification of whether the data in all our records is still up-to-date already, with the goal of expanding this further in the future. To enable such automatic verification, we cannot accept offline sources (including photos or scans of printed privacy policies that were not uploaded by the company themselves). Further, the provided sources need to contain the following strings exactly as written in the record:

* the name
* each runs entry
* the webform URL

If a PGP key is specified in the record:

* if both the fingerprint and URL are provided, the URL needs to appear exactly in the sources and the key behind that URL needs to have the provided fingerprint
* if only a URL is provided, that URL needs to appear exactly in the sources
* if only a fingerprint is provided, that fingerprint needs to appear exactly in the sources (though the whitespace may be different)

Other information like the address, phone and fax number, and email address will unfortunately often be obfuscated in the sources or be provided in a different format than we are using here. As such, we cannot extend the policy to those and our automated verification has to implement heuristics to still be able to detect them.
