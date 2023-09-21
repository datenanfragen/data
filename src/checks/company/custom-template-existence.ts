import { CompanyCheck } from '../../types/checks';

const check: CompanyCheck = {
    id: 'custom-template-existence',
    desc: 'If a record specifies a `custom-*-template` without also specifying a `request-language`, the template _must_ at least be available in English and _should_ also be available in the other languages, otherwise, it _must_ be available in the `request-language` (#1120).',
    url: 'https://github.com/datenanfragen/data/issues/1120',
    severity: 'ERROR',
    run: (json, ctx) => {
        return (
            [
                'custom-access-template',
                'custom-erasure-template',
                'custom-rectification-template',
                'custom-objection-template',
            ] as const
        ).map((prop) => {
            const template = json[prop];
            if (!template) return;

            if (json['request-language']) {
                if (!ctx.existingTemplatesPerLanguage[json['request-language']]?.includes(template))
                    return {
                        message: `Record specifies \`${prop}\` of \`${template}\` but that isn't available for \`request-language\` of \`${json['request-language']}\`.`,
                        json_pointer: `/${prop}`,
                    };
            } else {
                if (!ctx.existingTemplatesPerLanguage['en']?.includes(template))
                    return {
                        message: `Record specifies \`${prop}\` of \`${template}\` but that isn't available in English.

Maybe you forgot to set the \`request-language\`?`,
                        json_pointer: `/${prop}`,
                    };
            }

            return;
        });
    },
};
export default check;
