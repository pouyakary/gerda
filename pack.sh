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

electron-packager . Gerda --platform=darwin --arch=x64 --version=0.34.1 