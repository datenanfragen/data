#!/bin/bash
yarn ts-node src/test-records.ts --auto-fix || true
# https://github.com/reviewdog/reviewdog#diff
F=$(mktemp)
git diff >"${F}"
git clean -fd
git clean -f
~/bin/reviewdog -f=diff -f.diff.strip=1 -reporter=github-pr-review -tee <"${F}"
