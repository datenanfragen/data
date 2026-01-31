import { ObsoleteRecordCheck } from '../../types/checks';

const check: ObsoleteRecordCheck = {
    id: 'original-record-deleted',
    desc: 'There may not be a company record with the same slug as an obsolete record.',
    url: 'https://github.com/datenanfragen/data#handling-obsolete-records',
    severity: 'ERROR',
    run: (json, ctx) => {
        if (json['slug'] && ctx.existingCompanySlugs.includes(json['slug']))
            return {
                message: `There is an obsolete record with the slug \`${json['slug']}\`, but a company record with the same slug also exists. Did you forget to delete the company record?`,
                json_pointer: `/slug`,
            };

        return;
    },
};
export default check;
