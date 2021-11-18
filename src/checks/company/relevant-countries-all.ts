import { CompanyCheck } from '../../types/checks';

const check: CompanyCheck = {
    id: 'relevant-countries-all',
    desc: 'If `relevant-countries` contains `all`, it should only contain `all`.',
    severity: 'ERROR',
    run: (json) => {
        if (json['relevant-countries']) {
            const all_and = json['relevant-countries'].includes("all") && json["relevant-coutries"].length > 1
            if (!all_and)
                return {
                    message: `Record has redundant relevant-countries: \`all\` already covers : ${json["relevant-countries"].filter(x => x !== "all").join(",")}.`,
                    json_pointer: '/relevant-countries',
                    suggestions: ["all"] // should this be an array of arrays?
                };
        }
    },
};
export default check;

