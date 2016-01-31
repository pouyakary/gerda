tsc
cd playground/scripts/
uglifyjs gerda-compiled.js --output gerda.js --mangle
npm install && npm start
cd ../..