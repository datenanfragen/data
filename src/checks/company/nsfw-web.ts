import { CompanyCheck } from '../../types/checks';

const check: CompanyCheck = {
    id: 'nsfw-web',
    desc: "Records for companies that aren't safe-for-work may not specify a website.",
    url: 'https://github.com/datenanfragen/data/issues/1369',
    severity: 'ERROR',
    run: (json) => {
        if (json['nsfw'] === true && json['web']) {
            return {
                message:
                    'Record has `nsfw` set to `true` but also specifies `web`.\n\nIf this company is really not safe for work, remove the website.',
                json_pointer: '/web',
                suggestions: [undefined],
            };
        }
    },
};
export default check;
