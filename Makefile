#
# Gerda - The optimized Arendelle itelegent auto suggestion's server
#    Copyright 2016 Kary Foundation, Inc.
#    Author: Pouya Kary <k@karyfoundation.org>
#


#
# ──────────────────────────────────────────────────────────── 1 ─────────
#  :::::: P A R A M E T E R S : :  :  :   :     :        :          :
# ─────────────────────────────────────────────────────────────────────
#

# ────────────────────────────────────────────────────────────────────────────────

GERDA_SERVER 			= ./server/
GERDA_ARENDELLE_TOOLS	= $(GERDA_SERVER)arendelle-tools/
GERDA_FILESYSTEM 		= $(GERDA_ARENDELLE_TOOLS)file-system/

# ────────────────────────────────────────────────────────────────────────────────

GERDA_FILESYSTEM_FILES 	= $(GERDA_FILESYSTEM)file.ts $(GERDA_FILESYSTEM)directory.ts $(GERDA_FILESYSTEM)file-object.ts 
FILES 					= $(GERDA_FILESYSTEM_FILES)

# ────────────────────────────────────────────────────────────────────────────────

GERDA_PLAYGROUND_SCRIPT_DIR 	= playground/scripts
GERDA_SIMPLE_BINARY 			= $(GERDA_PLAYGROUND_SCRIPT_DIR)/gerda-compiled.js
GERDA_MAIN_OUTPUT 				= $(GERDA_PLAYGROUND_SCRIPT_DIR)/gerda.js

# ────────────────────────────────────────────────────────────────────────────────

UGLIFYJS_ARGUMENTS = --mangle

# ────────────────────────────────────────────────────────────────────────────────

PLAYGROUND_BUILD_SCRIPT = cd playground; npm install && npm start

# ────────────────────────────────────────────────────────────────────────────────



#
# ──────────────────────────────────────────────────────────────────── 2 ─────────
#  :::::: B U I L D   C O M M A N D S : :  :  :   :     :        :          :
# ─────────────────────────────────────────────────────────────────────────────
#

# ────────────────────────────────────────────────────────────────────────────────

build: $(GERRA_MAIN_OUTPUT)
	cp $(GERRA_MAIN_OUTPUT) ./playground/$(GERRA_MAIN_OUTPUT)

# ────────────────────────────────────────────────────────────────────────────────

$(GERDA_MAIN_OUTPUT): $(GERDA_SIMPLE_BINARY)
	uglifyjs $(GERDA_SIMPLE_BINARY) --output $(GERDA_MAIN_OUTPUT) $(UGLIFYJS_ARGUMENTS)
	
# ────────────────────────────────────────────────────────────────────────────────

$(GERDA_SIMPLE_BINARY): $(FILES)
	tsc
	
# ────────────────────────────────────────────────────────────────────────────────

electron: $(GERDA_MAIN_OUTPUT)
	$(PLAYGROUND_BUILD_SCRIPT)
	
# ────────────────────────────────────────────────────────────────────────────────
