import { AggregateAjvError } from '@segment/ajv-human-errors';
import { ajv } from '../../common/ajv';
import cdb_json_schema from '../../../schema.json';
import adb_json_schema from '../../../schema-supervisory-authorities.json';
import { Check } from '../../types/checks';

const cdb_schema = ajv.compile(cdb_json_schema);
const adb_schema = ajv.compile(adb_json_schema);

const check: Check = {
    id: 'pass-schema',
    desc: 'Records have to match the schema.',
    url: 'https://github.com/datenanfragen/data#data-formats',
    severity: 'ERROR',
    run: (json, ctx) => {
        const schema = ctx.file_path.startsWith('supervisory-authorities/') ? adb_schema : cdb_schema;
        // TODO: Provide better messages for common errors. `ajv-errors` might be useful for that.
        if (!schema(json)) {
            const errors = new AggregateAjvError(schema.errors || [], {
                fieldLabels: 'jsonPointer',
                includeData: true,
            });

            return Array.from(errors).map((e) => ({
                message: `Record did not pass schema validation: “${e.message}”

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
