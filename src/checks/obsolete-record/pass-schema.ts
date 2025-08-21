import { AggregateAjvError } from '@segment/ajv-human-errors';
import { ajv } from '../../common/ajv';
import jsonSchema from '../../../schema-obsolete-records.json';
import { ObsoleteRecordCheck } from '../../types/checks';

const schema = ajv.compile(jsonSchema);

const check: ObsoleteRecordCheck = {
    id: 'pass-schema',
    desc: 'Obsolete records have to match the schema.',
    url: 'https://github.com/datenanfragen/data#handling-obsolete-records',
    severity: 'ERROR',
    run: (json) => {
        if (!schema(json)) {
            const errors = new AggregateAjvError(schema.errors || [], {
                fieldLabels: 'jsonPointer',
                includeData: true,
            });

            return Array.from(errors).map((e) => ({
                message: `Obsolete record did not pass schema validation: “${e.message}”

Raw error:
\`\`\`json
${JSON.stringify(e, null, 4)}
\`\`\``,
                json_pointer: e.pointer,
            }));
        }

        return;
    },
};
export default check;
