#!/bin/bash
./env/local.bash
cd functions
npx tailwindcss -i ../public/stylesheets/tw-src.css -o ../public/stylesheets/tw-dest.css
npm run build
firebase serve