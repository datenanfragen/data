import { join, basename } from 'path';
import glob from 'glob';
import { CompanyPackCheck } from '../../types/checks';

const companies = glob
    .sync('*.json', { cwd: join(__dirname, '..', '..', '..', 'companies') })
    .map((f) => basename(f, '.json'));

const check: CompanyPackCheck = {
    id: 'company-existence',
    desc: 'The `companies` listed in a company pack need to actually exist (#1759).',
    url: 'https://github.com/datenanfragen/data/issues/1759',
    severity: 'ERROR',
    run: (json) => {
        return json
            .flatMap((pack, pack_idx) =>
                pack.companies.map((c, company_idx) => {
                    if (!companies.includes(c))
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
