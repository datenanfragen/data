from jsonschema import validate
import os
from pathlib import Path
import json

schema_companies = json.load(open('schema.json', encoding='utf-8'))
schema_authorities = json.load(open('schema-supervisory-authorities.json', encoding='utf-8'))

# see https://stackoverflow.com/a/10378012
pathlist_companies = Path('companies').glob('**/*.json')
for path in pathlist_companies:
    try:
        record = json.load(open(path, encoding='utf-8'))
        if record['slug'] + '.json' != os.path.basename(path):
            raise ValueError('Company filename "%s" does not match slug "%s".' % (os.path.basename(path)), record['slug'])
        validate(record, schema_companies)
    except:
        print(path)
        raise

pathlist_authorities = Path('supervisory-authorities').glob('**/*.json')
for path in pathlist_authorities:
    try:
        record = json.load(open(path, encoding='utf-8'))
        if record['slug'] + '.json' != os.path.basename(path):
            raise ValueError('Supervisory authority filename "%s" does not match slug "%s".' % (os.path.basename(path)), record['slug'])
        validate(record, schema_authorities)
    except:
        print(path)
        raise
