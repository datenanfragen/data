import { Check } from '../../types/checks';

const check: Check = {
    id: 'unusual-whitespace',
    desc: 'String fields should only use the regular ASCII spaces.',
    url: 'https://github.com/datenanfragen/data#data-formats',
    severity: 'ERROR',
    run: (json) => {
        // https://stackoverflow.com/a/51399843/
        const reg = /[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/;
        return (Object.keys(json) as (keyof typeof json)[]).map((key) => {
            const value = json[key];
            if (typeof value === 'string' && reg.test(value))
                return {
                    message: `Value of string field \`${key}\` contains non-ASCII spaces.`,
                    json_pointer: `/${key}`,
                    suggestions: [value.replace(reg, ' ')],
                };

            return;
            // TODO: Also deal with arrays and nested string fields.
        });
    },
};
export default check;
