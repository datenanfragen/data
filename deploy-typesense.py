import typesense
import os
from pathlib import Path
import json
import binascii


def get_field_defaults_for_schema_file(schema_file):
    return [(prop, [] if details['type'] == 'array' else '') for prop, details in json.load(open(schema_file, encoding = 'utf-8'))['properties'].items()]

def process_record(path, fields):
    record = json.load(path.open(encoding = 'utf-8'))
    record = {prop: (str(value) if type(value) is bool else value) for prop, value in record.items()}
    record['id'] = record['slug']
        
    # Typesense *expects* an int (or float) as a sortable field. We don't have that, so we use this rather ugly hack for now.
    record['sort-index'] = int(binascii.hexlify(str.encode(record['id']))[:7], 16)

    # Typesense also expects all fields declared in the schema to have a value.
    for field, default in fields:
        if field not in record: record[field] = default
    
    return record

def document_update(index, record):
    # TODO: Let's hope Typesense implements record updates in the future.
    try:
        client.collections[index].documents[record['id']].delete()
    except typesense.exceptions.ObjectNotFound:
        pass
    client.collections[index].documents.create(record)

def deploy_index(index, directory, fields):
    entrylist = [json.loads(entry) for entry in client.collections[index].documents.export() if len(entry) > 0]
    entries = {entry['id']: entry for entry in entrylist}
    
    pathlist = Path(directory).glob('**/*.json')
    for path in pathlist:
        record = process_record(path, fields)
        
        if not record['id'] in entries:
            print('Creating ' + record['id'])
            client.collections[index].documents.create(record)
        else:
            if record != entries[record['id']]:
                print('Updating ' + record['id'])
                document_update(index, record)
            del entries[record['id']]
    
    for id in entries.keys():
        print('Deleting ' + id)
        try:
            client.collections[index].documents[id].delete()
        except typesense.exceptions.ObjectNotFound:
            pass

client = typesense.Client({
    'master_node': {
        'host': 'localhost',
        'port': '8108',
        'protocol': 'http',
        'api_key': os.environ['TYPESENSE_API_KEY']
    },
    'timeout_seconds': 2
})

companies_fields = get_field_defaults_for_schema_file('schema.json')
svas_fields = get_field_defaults_for_schema_file('schema-supervisory-authorities.json')

deploy_index('companies', 'companies', companies_fields)
deploy_index('supervisory-authorities', 'supervisory-authorities', svas_fields)
