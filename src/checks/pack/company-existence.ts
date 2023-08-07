import { CompanyPackCheck } from '../../types/checks';

const check: CompanyPackCheck = {
    id: 'company-existence',
    desc: 'The `companies` listed in a company pack need to actually exist (#1759).',
    url: 'https://github.com/datenanfragen/data/issues/1759',
    severity: 'ERROR',
    run: (json, ctx) => {
        return json
            .flatMap((pack, pack_idx) =>
                pack.companies.map((c, company_idx) => {
                    if (!ctx.existingCompanySlugs.includes(c))
                        return {
                            message: `Pack lists company “${c}” but that doesn't exist.`,
                            json_pointer: `/${pack_idx}/companies/${company_idx}`,
                        };
                })
            )
            .filter((r) => r);
    },
};
export default check;
