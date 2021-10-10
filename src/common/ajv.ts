import Ajv from 'ajv';

export const ajv = new Ajv({ verbose: true });
// json-forms uses the `text` format for multi-line strings.
ajv.addFormat('text', () => true);
// ajv doesn't support the `idn-email` format. As validation of email addresses isn't exactly critical for us, we'll
// just use this *very* basic check.
ajv.addFormat('idn-email', /^\S+@\S+\.\S+$/);
