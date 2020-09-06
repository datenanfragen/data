const Typesense = require('typesense');
const chunk_array = require('chunk');
const bent = require('bent');
const glob = require('glob');
const path = require('path');

const client = new Typesense.Client({
    nodes: [
        {
            host: 'search-backend.datenanfragen.de',
            port: '443',
            protocol: 'https',
        },
    ],

    apiKey: process.env.TYPESENSE_API_KEY,
    connectionTimeoutSeconds: 10,
});
const post = bent('POST', 'json', 200, 'https://search-backend.datenanfragen.de', {
    'X-TYPESENSE-API-KEY': process.env.TYPESENSE_API_KEY,
});

const getFieldsForSchema = function (schema) {
    let fields = [{ name: 'sort-index', type: 'int32' }];

    for (const [field, details] of Object.entries(schema.properties)) {
        let prop_type = '';
        if (details.type === 'array') {
            if (details.items && details.items.type !== 'string') continue;
            else prop_type = 'string[]';
        } else if (details.type === 'boolean') prop_type = 'bool';
        else prop_type = 'string';

        fields.push({ name: field, type: prop_type, optional: !schema.required.includes(field) });
    }

    return fields;
};

// TODO: No. Please. We *need* to find something better than this. :'(
const intifySlug = (slug) =>
    Math.min(
        Number(
            Array.from(new TextEncoder().encode(slug))
                .slice(0, 7)
                .map((i) => i.toString().padStart(3, '0'))
                .join('')
        ),
        2147483640
    );

const setupCollection = async function (collection_name, schema_filename) {
    const schema = require(path.resolve(schema_filename));
    const fields = getFieldsForSchema(schema);

    await client.collections().create({
        name: collection_name,
        fields,
        default_sorting_field: 'sort-index',
    });
};

const deploy = async function (index, schema_filename, directory) {
    // The main collections are only aliases to the actual collection (named with a Unix timestamp).
    const collection_name = `${index}_${Date.now()}`;
    await setupCollection(collection_name, schema_filename);

    // Grab records and prepare for Typesense.
    const records = glob
        .sync(`./${directory}/*.json`)
        .map((file) => require(path.resolve(file)))
        .map((obj) => ({ ...obj, 'sort-index': intifySlug(obj.slug) }))
        .map((obj) => JSON.stringify(obj));

    // Insert in chunks of 1000 records (Typesense recommends packages < 1MB).
    for (const chunk of chunk_array(records, 1000)) {
        // TODO: Let's hope the Typesense JS library will implement this at some point.
        const result = await post(`/collections/${collection_name}/documents/import`, chunk.join('\n'));

        if (!result.success || result.num_imported !== chunk.length) {
            console.error(result);
            throw 'Importing failed!';
        }
    }

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
