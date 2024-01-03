#!/bin/bash
# the current dir must be the above (top) dir!
echo "[BEGIN] set up env files"
echo "argument: $1"
set -x

# for hosting (front end)
cp -f ./env/$1/* ./public/javascripts/

# for functions (back end)
# currently failed to unite to ts file between front and back...
# in future, I would like to resolve.
cp -f ./env/$1/publicEnvVarsModule.js ./functions/src/models/auth/publicEnvVarsModule.ts

set +x
echo "[  END] set up env files"