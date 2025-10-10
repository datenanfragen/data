import { checkAllStringsRecursive } from '../../common/util';
import { Check } from '../../types/checks';

const check: Check = {
    id: 'trim-string-fields',
    desc: 'String field values cannot have trailing or leading whitespace.',
    url: 'https://github.com/datenanfragen/data#data-formats',
    severity: 'ERROR',
    run: (json) => {
        return checkAllStringsRecursive(
            json,
            (value) => value !== value.trim(),
            (value, path) => ({
                message: `Value of string field \`${path}\` is not trimmed (it contains leading or trailing whitespace).`,
                json_pointer: path,
                suggestions: [value.trim()],
            })
        );
    },
};
export default check;
