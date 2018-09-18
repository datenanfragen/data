import json
import os
import typesense

# This only needs to be run once to setup the collection in Typesense (or when the schema is updated).
# IMPORTANT: It will *drop* previously setup collections, *including* their records.

client = typesense.Client({
    'master_node': {
        'host': 'search.datenanfragen.de',
        'port': '443',
        'protocol': 'https',
        'api_key': os.environ['TYPESENSE_API_KEY']
    },
    'timeout_seconds': 2
})


def get_fields_for_props(props):
    fields = []
    for prop, details in props:
        prop_type = ''
        if details["type"] == 'string': prop_type = 'string'
        elif details['type'] == 'array':
            if details['items'] and details['items']['type'] != 'string': continue
            prop_type = 'string[]'
        else: prop_type = 'string'

        fields.append({'name': prop, 'type': prop_type})

    return fields


def setup_index(index, schema_filename):
    try:
        client.collections[index].delete()
    except typesense.exceptions.ObjectNotFound:
        pass

    schema = json.load(open(schema_filename, encoding = 'utf-8'))
    fields = get_fields_for_props(schema['properties'].items())

    fields.append({'name': 'id', 'type': 'string'})
    fields.append({'name': 'sort-index', 'type': 'int32'})

    client.collections.create({
        'name': index,
        'fields': fields,
        'default_sorting_field': 'sort-index'  # TODO: Once we have the appropriate data, we can have an actual weight here.
    })


setup_index('companies', 'schema.json')
setup_index('supervisory-authorities', 'schema-supervisory-authorities.json')
