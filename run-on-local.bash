#!/bin/bash

set -x

echo "(1/5) transpile typescript"
tsc ./public/javascripts/*.ts

echo "(2/5) set cache buster for css files"
# Cache Buster
# reference https://zenn.dev/manase/scraps/fca1f8c03fc4d7
datetime=$(date +"%Y%m%d%H%M%S")
find "functions/src/views" -type f -name "*.ejs" -exec sed -i '' "s/ver=[0-9]\{14\}/ver=$datetime/g" {} \;

echo "(3/5) prepare env related files"
./env/copyEnvJSFileToPublicDir.bash local

echo "(4/5) build tailwindcss file"
cd functions
npx tailwindcss -i ../public/stylesheets/tw-src.css -o ../public/stylesheets/tw-dest.css

echo "(5/5) execute!"
npm run build
firebase serve

set +x