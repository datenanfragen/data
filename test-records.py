from jsonschema import validate
import os
from pathlib import Path
import json

schema_companies = json.load(open('schema.json', encoding='utf-8'))
schema_authorities = json.load(open('schema-supervisory-authorities.json', encoding='utf-8'))

# see https://stackoverflow.com/a/10378012
pathlist_companies = Path('data').glob('**/*.json')
for path in pathlist_companies: 
    try:
    	validate(json.load(open(path, encoding='utf-8')), schema_companies)
    except:
    	print(path)
    	raise

pathlist_authorities = Path('supervisory-authorities').glob('**/*.json')
for path in pathlist_authorities: 
    try:
    	validate(json.load(open(path, encoding='utf-8')), schema_authorities)
    except:
    	print(path)
    	raise