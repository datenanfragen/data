from algoliasearch import algoliasearch
import os
from pathlib import Path
import json

client = algoliasearch.Client(os.environ['algolia_app_id'], os.environ['algolia_admin_api_key'])
index = client.init_index('companies')

records = []

# see https://stackoverflow.com/a/10378012
pathlist = Path('data').glob('**/*.json')
for path in pathlist:
    record = json.load(open(path, encoding='utf-8'))
    record['objectID'] = record['slug']
    
    records.append(record)

index.saveObjects(records)