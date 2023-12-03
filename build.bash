#!/bin/bash

echo "convert ts to js"
tsc src/ts/*.ts

echo "process tailwind"
npx tailwindcss -i ./src/tw-src.css -o ./src/tw-dest.css