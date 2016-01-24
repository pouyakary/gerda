#
# Copyright 2016 Kary Foundation, Inc.
#    Author: Pouya Kary <k@karyfoundation.org>
#

GERDA_SERVER = ./gerda-server/
GERDA_FILESYSTEM = $(GERDA_SERVER)file-system/

GERDA_FILESYSTEM_FILES = $(GERDA_FILESYSTEM)file.ts $(GERDA_FILESYSTEM)directory.ts $(GERDA_FILESYSTEM)file-object.ts 
FILES = $(GERDA_FILESYSTEM_FILES)

GERDA_SIMPLE_BINARY = binary/gerda-compiled.js
GERRA_MAIN_OUTPUT = gerda.js

build: $(GERRA_MAIN_OUTPUT)

$(GERRA_MAIN_OUTPUT): $(GERDA_SIMPLE_BINARY)
	uglifyjs $(GERDA_SIMPLE_BINARY) --output gerda.js $(GERRA_MAIN_OUTPUT)
	
gerda-compiled.js: $(FILES)
	tsc
	
run: $(GERRA_MAIN_OUTPUT)
	node $(GERRA_MAIN_OUTPUT)