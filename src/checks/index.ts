import { join, basename } from 'path';
import { readdir } from 'fs/promises';
import { Check } from '../types/checks';

const linters = async () => {
    const importChecks = async (check_dir: string) =>
        Promise.all(
            (await readdir(join(__dirname, check_dir)))
                .map((f) => join(__dirname, check_dir, f))
                .map((f) =>
                    import(f).then((i) => {
                        if (basename(f, '.ts') !== i.default.id) throw new Error('Check filename has to match its ID.');
                        return i.default as Check;
                    })
                )
        );

    return {
        recordlint: {
            checks: await importChecks('record'),
            url: 'https://github.com/datenanfragen/data/blob/master/src/checks/record',
            path_filter: (path: string) => path.startsWith('companies/') || path.startsWith('supervisory-authorities/'),
        },
        companylint: {
            checks: await importChecks('company'),
            url: 'https://github.com/datenanfragen/data/blob/master/src/checks/company',
            path_filter: (path: string) => path.startsWith('companies/'),
        },
        // TODO: authoritylint
        packlint: {
            checks: await importChecks('pack'),
            url: 'https://github.com/datenanfragen/data/blob/master/src/checks/pack',
            path_filter: (path: string) => path.startsWith('company-packs/'),
        },
        genericlint: {
            checks: await importChecks('generic'),
            url: 'https://github.com/datenanfragen/data/blob/master/src/checks/generic',
            path_filter: (path: string) => path.startsWith('companies/') || path.startsWith('company-packs/') || path.startsWith('supervisory-authorities/') || path.startsWith('suggested-companies/'),
        },
    };
};
export default linters;
