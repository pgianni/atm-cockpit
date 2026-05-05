#!/bin/bash
cd "/Users/macnight/Documents/Claude/Projects/ATM Test/cockpit-app"
PORT=${PORT:-4173}
/usr/local/bin/node ./node_modules/.bin/vite preview --port "$PORT" --host
