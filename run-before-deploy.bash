#!/bin/bash

# this script is used when running on local, and github actions to deploy.

set -x

npm install

echo "(1/5) prepare env related files"
./env/overwriteEnvJSFiles.bash $1

echo "(2/5) transpile typescript"
tsc ./public/javascripts/*.ts

echo "(3/5) set cache buster for css files"
./run-cache-buster.bash

echo "(4/5) build tailwindcss file"
cd functions
npx tailwindcss -i ../public/stylesheets/tw-src.css -o ../public/stylesheets/tw-dest.css

echo "(5/5) npm"
npm run build

set +x