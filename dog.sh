#!/bin/bash

yarn ts-node src/test-records.ts --autofix
# https://github.com/reviewdog/reviewdog#diff
F=${mktemp}
echo "${F}"
git diff >"${F}"
git stash -u
git stash drop
./bin/reviewdog -f=diff -f.diff.strip=1 -reporter=github-pr-review <"${F}"
