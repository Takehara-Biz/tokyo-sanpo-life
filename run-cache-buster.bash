#!/bin/bash

set -x

# Cache Buster
# reference https://zenn.dev/manase/scraps/fca1f8c03fc4d7
datetime=$(date +"%Y%m%d%H%M%S")

if [[ "$OSTYPE" == "darwin"* ]]; then
  find "functions/src/views" -type f -name "*.ejs" -exec sed -i '' "s/ver=[0-9]\{14\}/ver=$datetime/g" {} \;
else
  find "functions/src/views" -type f -name "*.ejs" -exec sed "s/ver=[0-9]\{14\}/ver=$datetime/g" {} \;
fi

set +x