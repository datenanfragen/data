import typesense
import os
from pathlib import Path
import json
import binascii


def get_field_defaults_for_schema_file(schema_file):
    return [(prop, [] if details['type'] == 'array' else '') for prop, details in json.load(open(schema_file, encoding = 'utf-8'))['properties'].items()]


companies_fields = get_field_defaults_for_schema_file('schema.json')
svas_fields = get_field_defaults_for_schema_file('schema-supervisory-authorities.json')

client = typesense.Client({
    'master_node': {
        'host': 'search.datenanfragen.de',
        'port': '443',
        'protocol': 'https',
        'api_key': os.environ['TYPESENSE_API_KEY']
    },
    'timeout_seconds': 2
})

# ---- Companies ----
# TODO: Once implemented, use the bulk import feature instead of inserting records one-by-one: https://github.com/typesense/typesense/issues/35

pathlist_svas = Path('companies').glob('**/*.json')
for path in pathlist_svas:
    record = json.load(open(path, encoding = 'utf-8'))

    # TODO: Let's hope Typesense implements record updates in the future.
    try: client.collections['companies'].documents[record['slug']].delete()
    except typesense.exceptions.ObjectNotFound: pass

    record['id'] = record['slug']
    # Typesense *expects* an int (or float) as a sortable field. We don't have that, so we use this rather ugly hack for now.
    record['sort-index'] = int(binascii.hexlify(str.encode(record['slug']))[:7], 16)
    # Typesense also expects all fields declared in the schema to have a value.
    for field, default in companies_fields:
        if field not in record: record[field] = default

    client.collections['companies'].documents.create(record)

# ---- Supervisory authorities ----
pathlist_svas = Path('supervisory-authorities').glob('**/*.json')
for path in pathlist_svas:
    record = json.load(open(path, encoding = 'utf-8'))

    try: client.collections['supervisory-authorities'].documents[record['slug']].delete()
    except typesense.exceptions.ObjectNotFound: pass

    record['id'] = record['slug']
    record['sort-index'] = int(binascii.hexlify(str.encode(record['slug']))[:7], 16)
    for field, default in svas_fields:
        if field not in record: record[field] = default

    client.collections['supervisory-authorities'].documents.create(record)
