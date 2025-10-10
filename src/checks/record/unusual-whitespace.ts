import { checkAllStringsRecursive } from '../../common/util';
import { Check } from '../../types/checks';

const check: Check = {
    id: 'unusual-whitespace',
    desc: 'String fields should only use the regular ASCII spaces.',
    url: 'https://github.com/datenanfragen/data#data-formats',
    severity: 'ERROR',
    run: (json) => {
        const reg = /[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g;

        return checkAllStringsRecursive(
            json,
            (value) => reg.test(value),
            (value, path) => ({
                message: `Value of string field \`${path}\` contains non-ASCII spaces.`,
                json_pointer: path,
                suggestions: [value.replace(reg, ' ')],
            })
        );
    },
};
export default check;
