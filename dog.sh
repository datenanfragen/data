#!/bin/bash

yarn ts-node src/test-records.ts --auto-fix
# https://github.com/reviewdog/reviewdog#diff
ls
F=$(mktemp)
echo "F: -${F}-"
git diff >"${F}"
git clean -fd
git clean -f
echo "---"
cat "${F}"
echo "---"
~/bin/reviewdog -f=diff -f.diff.strip=1 -reporter=github-pr-review -tee <"${F}"
