import { Check } from '../../types/checks';

const check: Check = {
    id: 'name-in-address',
    desc: 'The name of the company cannot be contained in the address.',
    url: 'https://github.com/datenanfragen/data#addresses',
    severity: 'ERROR',
    run: (json) => {
        const address_lines = json['address'].split('\n');
        const contains_company_name = (el: string) => el.trim() === json['name'];

        if (address_lines.some(contains_company_name))
            return {
                message: 'Record includes `name` in the `address`.',
                json_pointer: '/address',
                suggestions: [address_lines.filter((x) => !contains_company_name(x)).join('\n')],
            };
    },
};
export default check;
