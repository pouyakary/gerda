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

UGLIFYJS_ARGUMENTS = --mangle

build: $(GERRA_MAIN_OUTPUT)
	cp $(GERRA_MAIN_OUTPUT) ./playground/$(GERRA_MAIN_OUTPUT)

$(GERRA_MAIN_OUTPUT): $(GERDA_SIMPLE_BINARY)
	uglifyjs $(GERDA_SIMPLE_BINARY) --output gerda.js $(GERRA_MAIN_OUTPUT) $(UGLIFYJS_ARGUMENTS)
	
$(GERDA_SIMPLE_BINARY): $(FILES)
	tsc