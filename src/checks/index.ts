import type { Check } from '../types/checks';

import addressNewlinesCheck from './record/address-newlines';
import endAddressInCountryCheck from './record/end-address-in-country';
import finalNewlineCheck from './record/final-newline';
import matchFilenameSlugCheck from './record/match-filename-slug';
import nameInAddressCheck from './record/name-in-address';
import passRecordSchemaCheck from './record/pass-schema';
import suggestedMediumExistsCheck from './record/suggested-medium-exists';
import trimAddressLinesCheck from './record/trim-address-lines';
import trimStringFieldsCheck from './record/trim-string-fields';
import unusualWhitespaceCheck from './record/unusual-whitespace';

import customTemplateExistenceCheck from './company/custom-template-existence';
import nameInRequiredElementsCheck from './company/name-in-required-elements';
import nameInRunsCheck from './company/name-in-runs';
import nsfwWebCheck from './company/nsfw-web';
import relevantCountriesAllCheck from './company/relevant-countries-all';
import testedRequirementsCheck from './company/tested-requirements';
import trackingCompanyRequiredElementsCheck from './company/tracking-company-required-elements';

import companyExistenceCheck from './pack/company-existence';
import passPackSchemaCheck from './pack/pass-schema';

const linters = {
    recordlint: {
        checks: [
            addressNewlinesCheck,
            endAddressInCountryCheck,
            finalNewlineCheck,
            matchFilenameSlugCheck,
            nameInAddressCheck,
            passRecordSchemaCheck,
            suggestedMediumExistsCheck,
            trimAddressLinesCheck,
            trimStringFieldsCheck,
            unusualWhitespaceCheck,
        ] as Check[],
        url: 'https://github.com/datenanfragen/data/blob/master/src/checks/record',
        path_filter: (path: string) => path.startsWith('companies/') || path.startsWith('supervisory-authorities/'),
    },
    companylint: {
        checks: [
            customTemplateExistenceCheck,
            nameInRequiredElementsCheck,
            nameInRunsCheck,
            nsfwWebCheck,
            relevantCountriesAllCheck,
            testedRequirementsCheck,
            trackingCompanyRequiredElementsCheck,
        ] as Check[],
        url: 'https://github.com/datenanfragen/data/blob/master/src/checks/company',
        path_filter: (path: string) => path.startsWith('companies/'),
    },
    // TODO: authoritylint
    packlint: {
        checks: [companyExistenceCheck, passPackSchemaCheck] as unknown as Check[],
        url: 'https://github.com/datenanfragen/data/blob/master/src/checks/pack',
        path_filter: (path: string) => path.startsWith('company-packs/'),
    },
};
export default linters;
