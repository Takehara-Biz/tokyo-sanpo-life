#!/bin/bash

echo "build hosting"
tsc ./public/javascripts/*.ts
# Cache Buster
# reference https://zenn.dev/manase/scraps/fca1f8c03fc4d7
datetime=$(date +"%Y%m%d%H%M%S")
find "functions/src/views" -type f -name "*.ejs" -exec sed -i '' "s/ver=[0-9]\{14\}/ver=$datetime/g" {} \;

echo "build functions"
./env/local.bash
cd functions
npx tailwindcss -i ../public/stylesheets/tw-src.css -o ../public/stylesheets/tw-dest.css
npm run build
firebase serve