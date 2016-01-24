#
# Copyright 2016 Kary Foundation, Inc.
#    Author: Pouya Kary <k@karyfoundation.org>
#

GERDA_SERVER = ./gerda-server/
GERDA_FILESYSTEM = $(GERDA_SERVER)file-system/
FILES = $(GERDA_FILESYSTEM)file.ts

build: gerda.js
	uglifyjs gerda.js --output gerda.js
	
gerda.js: $(FILES)
	tsc