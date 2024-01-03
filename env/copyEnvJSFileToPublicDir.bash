#!/bin/bash
# the current dir must be the above (top) dir!
echo "[BEGIN] copy env js file to public dir"
echo "argument: $1"
set -x
cp -f ./env/$1/publicEnvVars.js ./public/javascripts/
set +x
echo "[  END] copy env js file to public dir"