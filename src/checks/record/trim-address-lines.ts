import { Check } from '../../types/checks';

const check: Check = {
    id: 'trim-address-lines',
    desc: 'The lines of the address cannot have trailing or leading whitespace.',
    url: 'https://github.com/datenanfragen/data#addresses',
    severity: 'ERROR',
    run: (json) => {
        const address_lines = json['address'].split('\n');

        if (address_lines.some((line) => line !== line.trim()))
            return {
                message:
                    "The lines of the `address` aren't trimmed (at least one line contains trailing or leading whitespace).",
                json_pointer: '/address',
                suggestions: [address_lines.map((line) => line.trim()).join('\n')],
            };
    },
};
export default check;
