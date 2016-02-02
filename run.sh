#! /bin/bash
#
# Gerda - The optimized Arendelle itelegent auto suggestion's server
#    Copyright 2016 Kary Foundation, Inc.
#    Author: Pouya Kary <k@karyfoundation.org>
#

# Compiling Gerda
tsc

# optimizing Gerda
cd playground/scripts/
uglifyjs gerda-compiled.js --output gerda.js --mangle

# Running the Electron Playground
npm start

# Done
cd ../..