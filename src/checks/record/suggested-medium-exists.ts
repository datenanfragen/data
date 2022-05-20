import { Check } from '../../types/checks';
import { SuggestedTransportMedium } from '../../types/CompanyRecord';

const check: Check = {
    id: 'suggested-medium-exists',
    desc: 'The suggested transport medium should be specified in the record.',
    url: 'https://github.com/datenanfragen/data/issues/1740',
    severity: 'ERROR',
    run: (json) => {
        if (!('suggested-transport-medium' in json)) return;
        const medium = json['suggested-transport-medium'];
        if (medium == SuggestedTransportMedium.Letter) return; // this is covered by the schema itself, as records have to have an address.
        if (!(medium in json))
            return {
                message: `Suggested-transport-medium is set to '${medium}', but the ${medium} is not defined in the record.`,
                json_pointer: '/suggested-transport-medium',
            };
    },
};

export default check;
