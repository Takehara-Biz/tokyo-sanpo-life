#!/bin/bash

set -x

# Reference
# https://stackoverflow.com/questions/43171648/sed-gives-sed-cant-read-no-such-file-or-directory
SEDOPTION=
if [[ "$OSTYPE" == "darwin"* ]]; then
  SEDOPTION=-i ''
fi

# Cache Buster
# reference https://zenn.dev/manase/scraps/fca1f8c03fc4d7
datetime=$(date +"%Y%m%d%H%M%S")
find "functions/src/views" -type f -name "*.ejs" -exec sed $SEDOPTION "s/ver=[0-9]\{14\}/ver=$datetime/g" {} \;

set +x