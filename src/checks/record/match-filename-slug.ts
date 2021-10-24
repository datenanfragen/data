import { basename } from 'path';
import { Check } from '../../types/checks';

const check: Check = {
    id: 'match-filename-slug',
    desc: 'Record filenames have to match their slug.',
    url: 'https://github.com/datenanfragen/data/#data-formats',
    severity: 'ERROR',
    run: (json, ctx) => {
        const filename = basename(ctx.file_path);
        if (json.slug + '.json' !== filename)
            return {
                message: `Filename \`${filename}\` does not match slug \`${json.slug}\`.

Either rename the file or change the slug.`,
                json_pointer: '/slug',
                suggestions: [basename(filename, '.json')],
            };
    },
};
export default check;
