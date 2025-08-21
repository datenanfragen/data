import { ObsoleteRecordCheck } from '../../types/checks';

const check: ObsoleteRecordCheck = {
    id: 'redirect-to-exists',
    desc: 'If the record specifies `redirect-to`, a company record with the same slug must exist.',
    url: 'https://github.com/datenanfragen/data#handling-obsolete-records',
    severity: 'ERROR',
    run: (json, ctx) => {
        if (json['redirect-to'] && !ctx.existingCompanySlugs.includes(json['redirect-to']))
            return {
                message: `Obsolete record specifies \`redirect-to\` of \`${json['redirect-to']}\`, but a company record with this slug does not exist.`,
                json_pointer: `/redirect-to`,
            };

        return;
    },
};
export default check;
