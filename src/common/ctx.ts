import glob from 'glob';
import { basename, join } from 'path';

export const existingCompanySlugs = glob
    .sync('*.json', { cwd: join(__dirname, '..', '..', 'companies') })
    .map((f) => basename(f, '.json'));

export const existingTemplatesPerLanguage = glob
    .sync('**/*.txt', { cwd: join(__dirname, '..', '..', 'templates') })
    .reduce<Record<string, string[]>>((acc, cur) => {
        const [lang, name] = cur.replace('.txt', '').split('/');
        if (!acc[lang]) acc[lang] = [];
        acc[lang].push(name);
        return acc;
    }, {});
