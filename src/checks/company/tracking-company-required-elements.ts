import { CompanyCheck } from '../../types/checks';

const check: CompanyCheck = {
    id: 'tracking-company-required-elements',
    desc: 'If a record uses a tracking template (making it a "tracking company" in our terminology), it cannot have `required-elements` set as tracking companies ask for contact details (which are always the same fields) instead of identification data (which differs by company) in our generator.',
    url: 'https://github.com/datenanfragen/data/issues/1445',
    severity: 'ERROR',
    run: (json) => {
        return (['access', 'erasure', 'rectification', 'objection'] as const).map((type) => {
            const template = `${type}-tracking`;

            if (json[`custom-${type}-template`] === template && json['required-elements']) {
                return {
                    message: `Record uses tracking template \`${template}\` as \`${`custom-${type}-template`}\` but also has \`required-elements\` set.

If this is really a "tracking company", remove the required elements.`,
                    json_pointer: `/required-elements`,
                    suggestions: [undefined],
                };
            }
        });
    },
};
export default check;
