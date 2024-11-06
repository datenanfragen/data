import { Check, CheckInstance } from '../../types/checks';

const reg = /[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/;

const sub_check = (key: string, value: string | (string | undefined)[] | undefined, nested = false) => {
    if (typeof value === 'string' && reg.test(value))
        return {
            message: `Value of string field \`${key}\` contains non-ASCII spaces.`,
            json_pointer: `/${key}`,
            suggestions: [value.replace(reg, ' ')],
        };
    return undefined;
}


const check: Check = {
    id: 'unusual-whitespace',
    desc: 'String fields should only use the regular ASCII spaces.',
    url: 'https://github.com/datenanfragen/data#data-formats',
    severity: 'ERROR',
    run: (json) => {
        // https://stackoverflow.com/a/51399843/

        return (Object.keys(json) as (keyof typeof json)[]).flatMap((key) => {
            const value = json[key];

            const results: (CheckInstance | undefined)[] = [];
            results.push(sub_check(key, value));

            if (Array.isArray(value)) {
                for (const element of value) {
                    results.push(sub_check(key, element, true));
                }
            }

            return results;
            // TODO: Also deal with nested string fields.
        });
    },
};
export default check;
