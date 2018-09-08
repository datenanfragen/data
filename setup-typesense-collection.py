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


# ---- Companies ----
try: client.collections['companies'].delete()
except typesense.exceptions.ObjectNotFound: pass

svas_schema = json.load(open('schema.json', encoding = 'utf-8'))
svas_fields = get_fields_for_props(svas_schema['properties'].items())

svas_fields.append({'name': 'id', 'type': 'string'})
svas_fields.append({'name': 'sort-index', 'type': 'int32'})

client.collections.create({
    'name': 'companies',
    'fields': svas_fields,
    'default_sorting_field': 'sort-index'  # TODO: Once we have the appropriate data, we can have an actual weight here.
})

# ---- Supervisory authorities ----
try: client.collections['supervisory-authorities'].delete()
except typesense.exceptions.ObjectNotFound: pass

svas_schema = json.load(open('schema-supervisory-authorities.json', encoding = 'utf-8'))
svas_fields = get_fields_for_props(svas_schema['properties'].items())

svas_fields.append({'name': 'id', 'type': 'string'})
svas_fields.append({'name': 'sort-index', 'type': 'int32'})

client.collections.create({
    'name': 'supervisory-authorities',
    'fields': svas_fields,
    'default_sorting_field': 'sort-index'
})
