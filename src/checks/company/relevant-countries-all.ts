import { CompanyCheck } from '../../types/checks';
import { RelevantCountry } from '../../types/CompanyRecord';

const check: CompanyCheck = {
    id: 'relevant-countries-all',
    desc: 'If `relevant-countries` contains `all`, it should only contain `all`.',
    url: 'https://github.com/datenanfragen/data#relevant-countries',
    severity: 'ERROR',
    run: (json) => {
        if (json['relevant-countries']) {
            if (json['relevant-countries'].includes(RelevantCountry.All) && json["relevant-countries"].length > 1)
                return {
                    message: `Record has redundant \`relevant-countries\`: \`all\` already covers: ${json["relevant-countries"].filter(x => x !== "all").join(",")}.`,

                    json_pointer: '/relevant-countries',
                    suggestions: [["all"]]
                };
        }
    },
};
export default check;

