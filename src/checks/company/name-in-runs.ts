import { CompanyCheck } from '../../types/checks';

const check: CompanyCheck = {
    id: 'name-in-runs',
    desc: 'The name of the company cannot be contained in the runs array. It may only contain other services and companies.',
    url: 'https://github.com/datenanfragen/data/blob/0130049402832ee7ecd0f99986c42aa3334288cd/schema.json#L43',
    severity: 'ERROR',
    run: (json) => {
        const contains_company_name = (el: string) => el.trim() === json['name'];

        if (json['runs']?.some(contains_company_name))
            return {
                message: 'Record includes `name` in `runs`.',
                json_pointer: '/runs',
                suggestions: [json['runs'].filter((x) => !contains_company_name(x))],
            };
    },
};
export default check;
