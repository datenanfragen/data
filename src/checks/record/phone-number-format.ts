import { Check } from '../../types/checks';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const check: Check = {
    id: 'phone-number-format',
    desc: 'The phone and fax number must be formatted according to libphonenumber.',
    url: 'https://github.com/datenanfragen/data/issues/2165',
    severity: 'ERROR',
    run: (json) => {
        for (const field of ['phone', 'fax'] as const) {
            if (json[field]) {
                const original = json[field];
                const formatted = parsePhoneNumberFromString(original)?.formatInternational();

                if (!formatted || formatted !== original) {
                    return {
                        message: `The \`${field}\` number is not formatted correctly.`,
                        json_pointer: `/${field}`,
                        suggestions: formatted ? [formatted] : undefined,
                    };
                }
            }
        }

        return;
    },
};
export default check;
