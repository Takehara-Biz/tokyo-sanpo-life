#!/bin/bash
./env/local.bash
cd functions
npm run build
firebase serve