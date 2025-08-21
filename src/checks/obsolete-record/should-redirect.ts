import { ObsoleteRecordCheck } from '../../types/checks';

const check: ObsoleteRecordCheck = {
    id: 'should-redirect',
    desc: 'Obsolete records that set the reason `company-acquired`, `company-merged` or `duplicate` must also set `redirect-to`.',
    url: 'https://github.com/datenanfragen/data#handling-obsolete-records',
    severity: 'ERROR',
    run: (json) => {
        if (
            json['reason'] &&
            ['company-acquired', 'company-merged', 'duplicate'].includes(json['reason']) &&
            !json['redirect-to']
        )
            return {
                message: `Obsolete record specifies \`reason\` of \`${json['reason']}\`, but does not specify \`redirect-to\`. Since in these cases, there is always a controller for the affected data, we want to give users a way to contact them. You need to either specify an existing record or create a new one if necessary.`,
                json_pointer: `/reason`,
            };

        return;
    },
};
export default check;
