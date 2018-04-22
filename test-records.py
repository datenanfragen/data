from jsonschema import validate
import os
from pathlib import Path
import json

schema = json.load(open('schema.json', encoding='utf-8'))

# see https://stackoverflow.com/a/10378012
pathlist = Path('data').glob('**/*.json')
for path in pathlist:
    record = json.load(open(path, encoding='utf-8'))
    validate(record, schema)