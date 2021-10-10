The types in `AuthorityRecord.ts` and `CompanyRecord.ts` are automatically generated using [quicktype](https://github.com/quicktype/quicktype) like so:

```sh
yarn quicktype -s schema schema.json -o src/types/CompanyRecord.ts --just-types --acronym-style original
yarn quicktype -s schema schema-supervisory-authorities.json -o src/types/AuthorityRecord.ts --just-types --acronym-style original
```

They need to be updated manually when either of the schemas changes.
