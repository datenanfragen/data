import { AggregateAjvError } from '@segment/ajv-human-errors';
import { ajv } from '../../common/ajv';
import json_schema from '../../../schema-company-packs.json';
import { CompanyPackCheck } from '../../types/checks';

const schema = ajv.compile(json_schema);

const check: CompanyPackCheck = {
    id: 'pass-schema',
    desc: 'Company packs have to match the schema.',
    url: 'https://github.com/datenanfragen/data#company-packs',
    severity: 'ERROR',
    run: (json) => {
        if (!schema(json)) {
            const errors = new AggregateAjvError(schema.errors || [], {
                fieldLabels: 'jsonPointer',
                includeData: true,
            });

            return Array.from(errors).map((e) => ({
                message: `Company pack did not pass schema validation: “${e.message}”

Raw error:
\`\`\`json
${JSON.stringify(e, null, 4)}
\`\`\``,
                json_pointer: e.pointer,
            }));
        }
    },
};
export default check;
