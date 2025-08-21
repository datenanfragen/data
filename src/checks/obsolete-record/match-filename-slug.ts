import { basename } from 'path';
import { ObsoleteRecordCheck } from '../../types/checks';

const check: ObsoleteRecordCheck = {
    id: 'match-filename-slug',
    desc: 'Obsolete record filenames have to match their slug.',
    url: 'https://github.com/datenanfragen/data#handling-obsolete-records',
    severity: 'ERROR',
    run: (json, ctx) => {
        const filename = basename(ctx.file_path);
        if (json['slug'] + '.json' !== filename)
            return {
                message: `Filename \`${filename}\` does not match slug \`${json.slug}\`. They need to match and be the same as the original record.`,
                json_pointer: '/slug',
                suggestions: [basename(filename, '.json')],
            };

        return;
    },
};
export default check;
