from algoliasearch import algoliasearch
import os
from pathlib import Path
import json

client = algoliasearch.Client(os.environ['algolia_app_id'], os.environ['algolia_admin_api_key'])

# ---- Companies ----

index_companies = client.init_index('companies')
records_companies = []

# see https://stackoverflow.com/a/10378012
pathlist_companies = Path('companies').glob('**/*.json')
for path in pathlist_companies:
    record = json.load(open(path, encoding='utf-8'))
    record['objectID'] = record['slug']
    
    records_companies.append(record)

index_companies.saveObjects(records_companies)

# ---- Supervisory authorities ----

index_svas = client.init_index('supervisory-authorities')
records_svas = []

pathlist_svas = Path('supervisory-authorities').glob('**/*.json')
for path in pathlist_svas:
    record = json.load(open(path, encoding='utf-8'))
    record['objectID'] = record['slug']
    
    records_svas.append(record)

index_svas.saveObjects(records_svas)   