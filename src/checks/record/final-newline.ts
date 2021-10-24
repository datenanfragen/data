import { Check } from '../../types/checks';

const check: Check = {
    id: 'final-newline',
    desc: 'JSON files have to end with exactly one newline.',
    url: 'https://github.com/datenanfragen/data/#data-formats',
    severity: 'ERROR',
    run: (json, ctx) => {
        if (!ctx.file_content.toString().endsWith('}\n'))
            return {
                message: `File doesn't end with exactly one newline.`,
                location: { start: { line: ctx.file_content.split('\n').length } },
                suggestions: ['}\n'],
            };
    },
};
export default check;
