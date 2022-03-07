import Typesense from 'typesense';
import { CollectionFieldSchema, FieldType } from 'typesense/lib/Typesense/Collection';
import chunk_array from 'chunk';
import glob from 'glob';
import path from 'path';
import fs from 'fs/promises';

type Schema = {
    properties: Record<string, { type: string; items?: { type: string; enum: string[] } }>;
    required: string[];
};

if (!process.env.TYPESENSE_API_KEY) throw new Error('You need to set the `TYPESENSE_API_KEY` environment variable.');

const client = new Typesense.Client({
    nodes: [
        {
            host: 'search-backend.datenanfragen.de',
            port: 443,
            protocol: 'https',
        },
    ],

    apiKey: process.env.TYPESENSE_API_KEY,
    connectionTimeoutSeconds: 10,
});

const getFieldsForSchema = function (schema: Schema) {
    const fields: CollectionFieldSchema[] = [{ name: 'sort-index', type: 'int32' }];

    for (const [field, details] of Object.entries(schema.properties)) {
        let prop_type: FieldType = 'auto';
        if (details.type === 'array') {
            if (details.items && details.items.type !== 'string') continue;
            else prop_type = 'string[]';
        } else if (details.type === 'boolean') prop_type = 'bool';
        else prop_type = 'string';

        fields.push({ name: field, type: prop_type, optional: !schema.required.includes(field) });
    }

    return fields;
};

const setupCollection = async function (collection_name: string, schema_filename: string) {
    const schema: Schema = JSON.parse(await fs.readFile(schema_filename, { encoding: 'utf8' }));
    const fields = getFieldsForSchema(schema);

    await client.collections().create({
        name: collection_name,
        fields,
        default_sorting_field: 'sort-index',
    });
};

const deploy = async function (
    index: 'companies' | 'supervisory-authorities',
    schema_filename: string,
    directory: string
) {
    // The main collections are only aliases to the actual collection (named with a Unix timestamp).
    const collection_name = `${index}_${Date.now()}`;
    await setupCollection(collection_name, schema_filename);

    // Grab records and prepare for Typesense.
    const records = glob
        .sync(`./${directory}/*.json`)
        .map((file) => require(path.resolve(file)))
        .map((obj) => ({ ...obj, 'sort-index': 1 }));

    // Insert in chunks of 1000 records (Typesense recommends packages < 1MB).
    for (const chunk of chunk_array(records, 1000)) await client.collections(collection_name).documents().import(chunk);

    // Update the alias to the new collection only after importing successfully.
    await client.aliases().upsert(index, { collection_name });
    console.log('Collection', index, 'is now aliased to', collection_name);

    // Garbage-collect the old collections, keeping the last three just in case.
    const collections_to_delete = (await client.collections().retrieve())
        .map((c) => c.name)
        .filter((c) => c.startsWith(index + '_'))
        .filter((c) => c !== collection_name)
        .sort()
        .slice(0, -3);

    for (const c of collections_to_delete) {
        console.log('Deleting old collection', c);
        await client.collections(c).delete();
    }
};

const main = async function () {
    await deploy('companies', 'schema.json', 'companies');
    await deploy('supervisory-authorities', 'schema-supervisory-authorities.json', 'supervisory_authorities');
};

main();
