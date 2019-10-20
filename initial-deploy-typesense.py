import typesense
import os
import json

client = typesense.Client({
    'master_node': {
        'host': 'search.datenanfragen.de',
        'port': '443',
        'protocol': 'https',
        'api_key': os.environ['TYPESENSE_API_KEY']
    },
    'timeout_seconds': 2
})

def check_or_create_collection(index, schema_file):
    fields = [{'name': prop, 'type': details['type'] if details['type'] != 'array' else details['items']['type'] + '[]'} for prop, details in json.load(open(schema_file, encoding = 'utf-8'))['properties'].items()]
    schema =  {
        'name': index,
        'fields': fields,
        'default_sorting_field': 'sort-index'
    }
    print(schema)
    if (index in [entry['name'] for entry in client.collections.retrieve()]):
        client.collections[index].delete()
    client.collections.create(schema)

check_or_create_collection('companies', 'schema.json')
check_or_create_collection('supervisory-authorities', 'schema-supervisory-authorities.json')