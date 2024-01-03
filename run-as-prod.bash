#!/bin/bash
./env/prod.bash
cd functions
npm run build
firebase serve