import { Check, CheckInstance } from '../../types/checks';

const sub_check = (key: string, value: string | (string | undefined)[] | undefined, nested = false) => {
    if (typeof value === 'string' && value !== value.trim())
        return {
            message: nested ? `Value of array \`${key}\` is not trimmed ("${value}").` : `Value of string field \`${key}\` is not trimmed (it contains leading or trailing whitespace).`,
            json_pointer: `/${key}`,
            suggestions: nested ? undefined:[value.trim()],
        };
    return undefined;
};

const check: Check = {
    id: 'trim-string-fields',
    desc: 'String field values cannot have trailing or leading whitespace.',
    url: 'https://github.com/datenanfragen/data#data-formats',
    severity: 'ERROR',
    run: (json) => {
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
