import { Check } from '../../types/checks';

const check: Check = {
    id: 'trim-string-fields',
    desc: 'String field values cannot have trailing or leading whitespace.',
    url: 'https://github.com/datenanfragen/data#data-formats',
    severity: 'ERROR',
    run: (json) => {
        return (Object.keys(json) as (keyof typeof json)[]).map((key) => {
            const value = json[key];
            if (typeof value === 'string' && value !== value.trim())
                return {
                    message: `Value of string field \`${key}\` is not trimmed (it contains leading or trailing whitespace).`,
                    json_pointer: `/${key}`,
                    suggestions: [value.trim()],
                };
            // TODO: Also deal with arrays and nested string fields.
        });
    },
};
export default check;
