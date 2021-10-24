import { CompanyCheck } from '../../types/checks';

const check: CompanyCheck = {
    id: 'tested-requirements',
    desc: 'A `quality` of `tested` may only be set if `required-elements` are specified.',
    url: 'https://github.com/datenanfragen/data/issues/811',
    severity: 'ERROR',
    run: (json) => {
        if (json['quality'] === 'tested' && !json['required-elements']) {
            return {
                message:
                    "Record has `quality` of `tested` but doesn't specify `required-elements`.\n\nPreferably set `required-elements`, otherwise demote to `verified`.",
                json_pointer: '/quality',
                suggestions: ['verified'],
            };
        }
    },
};
export default check;
