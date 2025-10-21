import {globSync} from 'glob';
import { basename, join } from 'path';

export const existingCompanySlugs = globSync('*.json', { cwd: join(__dirname, '..', '..', 'companies') })
    .map((f) => basename(f, '.json'));

export const existingTemplatesPerLanguage = globSync('**/*.txt', { cwd: join(__dirname, '..', '..', 'templates') })
    .reduce<Record<string, string[]>>((acc, cur) => {
        const [lang, name] = cur.replace('.txt', '').split('/');
        if (!lang || !name) return acc;

        if (!acc[lang]) acc[lang] = [];
        acc[lang]!.push(name);
        return acc;
    }, {});
