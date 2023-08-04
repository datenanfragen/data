import { basename, extname } from 'path';
import { exit } from 'process';
import { Check } from '../../types/checks';

const check: Check = {
    id: 'json-file-extension',
    desc: 'Data files should end with `.json` (#2025)',
    url: 'https://github.com/datenanfragen/data/#data-formats',
    severity: 'ERROR',
    run: (json, ctx) => {
        const filename = basename(ctx.file_path); 
        const file_extension = extname(ctx.file_path)
        
        if (file_extension != ".json")
            return {
                message: `File \`${filename}\` should end in .json. Please rename the file.`,
                location: { start: { line: 1 } },
                suggestions: [basename(filename, file_extension) + '.json'],
            };
    },
};
export default check;
