# Company packs

The company packs are bundles of related companies that hold data on many people in a certain country, with the goal of making it easier for users to send requests to them.

For each supported country, there is a JSON file of the packs in the `company-packs` folder, named after the ISO 3166-1 alpha-2 country code. Additionally, company packs that are relevant for users in all countries are in the `all.json` file.  
The JSON files follow the schema specified in `schema-company-packs.json`. They are an array of the company packs.

Each company pack has a `slug`, a `type` (where `add-all` means that all companies in the pack are relevant to the vast majority of users and they should all be immediately added, and `choose` means that it is likely that some companies are not relevant to all users and users should choose which companies they want to add), and finally `companies`, a JSON array of the slugs of the included companies.

One company can appear in multiple packs. Per-country packs are merged with an `all` pack with the same slug, if it exists. 

As being listed in a pack can have an effect on the number of requests a company receives, we need to be especially mindful here and only add companies that provably fit the pack and hold data on many people. For that reason, commits that change a pack must include sufficient documentation and sources in the commit message. Each source must have an archived link, preferably from archive.org. A single commit may only change a single pack.
