#!/bin/bash
tsc ./public/javascripts/*.ts
npx tailwindcss -i ./public/stylesheets/tw-src.css -o ./public/stylesheets/tw-dest.css
npx ts-node index.ts