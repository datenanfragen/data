import { Check } from '../../types/checks';

const check: Check = {
    id: 'address-newlines',
    desc: 'Address lines have to be separated by newlines.',
    url: 'https://github.com/datenanfragen/data#addresses',
    severity: 'ERROR',
    run: (json) => {
        if (json['address'].split('\n').length < 2)
            return {
                message: 'Lines of the `address` are not separated by newlines (\\n).',
                json_pointer: '/address',
                suggestions: json['address'].includes(',') && [json['address'].replace(/\s*,\s*/g, '\n')],
            };
    },
};
export default check;
