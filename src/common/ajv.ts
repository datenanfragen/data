import Ajv from 'ajv';
import addFormats from 'ajv-formats';
// It's really not worth it to write TypeScript declarations for this.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import addMoreFormats from 'ajv-formats-draft2019';

export const ajv = new Ajv({ verbose: true, allErrors: true });
addFormats(ajv, { mode: 'fast' });
addMoreFormats(ajv);
// json-forms uses the `text` format for multi-line strings.
ajv.addFormat('text', { validate: () => true, type: 'string' });
