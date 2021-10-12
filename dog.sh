#!/bin/bash

yarn ts-node src/test-records.ts --autofix
# https://github.com/reviewdog/reviewdog#diff
ls
F=${mktemp}
echo "F: -${F}-"
git diff >"${F}"
git clean -fd
git clean -f
./bin/reviewdog -f=diff -f.diff.strip=1 -reporter=github-pr-review <"${F}"
