# 
# - Minify CSS and JAVASCRIPT
# - Copy to output folder
# 
# Patterns matching CSS files that should be minified. Files with a -min.css


PROD_DIR = /var/www/html
TMP_SRC_DIR = /home/ec2-user/WebsiteTricker

#PROD_DIR = /var/www
#TMP_SRC_DIR = F:/Programmation/Web/Tricker
#JS_OUTPUT = $(PROD_DIR)/webroot/js/src
#CSS_OUTPUT = $(PROD_DIR)/webroot/css

# suffix will be ignored.
CSS_FILES = $(filter-out %.min.css,$(wildcard \
	$(TMP_SRC_DIR)/webroot/css/*.css \
	$(TMP_SRC_DIR)/webroot/css/**/*.css \
))

# Patterns matching JS files that should be minified. Files with a -min.js
# suffix will be ignored.
JS_FILES = $(filter-out %.min.js %.spec.js,$(wildcard \
	$(TMP_SRC_DIR)/webroot/js/src/*.js \
	$(TMP_SRC_DIR)/webroot/js/src/**/*.js \
	$(TMP_SRC_DIR)/webroot/js/src/**/**/*.js \
))

DB_SOURCE = $(TMP_SRC_DIR)/resources/database/trickers.sql

##############################################################################

$(info ************ MAKEFILE **********)
$(info => Production	: $(PROD_DIR))
$(info => Sources	: $(TMP_SRC_DIR))
$(info ********************************)

clone:
	git clone https://github.com/scallacs/tricker.git $(TMP_SRC_DIR)
	

# target: prod build the production website
prod: copy-sources 

.PHONY: database
database: $(DB_SOURCE)
	echo "CREATE DATABASE IF NOT EXISTS trickers" |  mysql -uroot -pr4xc3oSFSTDB -hlocalhost
	mysql -uroot -pr4xc3oSFSTDB -hlocalhost trickers < $(DB_SOURCE)

# target: init-prod - Init the target directory. Create a copy 
init-prod:
	cp -r $(PROD_DIR) /home/ec2-user/ProductionCopy
	rm -rf $(PROD_DIR)/*
	
copy-sources: copy-backend-sources copy-frontend-sources

copy-backend-sources: 
	$(info ************ Copying backend sources **********)
	cp -r $(TMP_SRC_DIR)/src $(PROD_DIR)/src
	cp -r $(TMP_SRC_DIR)/config $(PROD_DIR)/config
	cd $(TMP_SRC_DIR)
	cp $(TMP_SRC_DIR)/index.php $(PROD_DIR)
	cp $(TMP_SRC_DIR)/composer.json $(PROD_DIR)
	cp $(TMP_SRC_DIR)/composer.lock $(PROD_DIR)
	cp $(TMP_SRC_DIR)/.htaccess $(PROD_DIR)
	mkdir -p $(PROD_DIR)/webroot
	cp $(TMP_SRC_DIR)/webroot/index.php $(PROD_DIR)/webroot
	cp $(TMP_SRC_DIR)/webroot/.htaccess $(PROD_DIR)/webroot
	mkdir -p $(PROD_DIR)/vendor
	mkdir -p $(PROD_DIR)/plugins
	mkdir -p $(PROD_DIR)/logs
	mkdir -p $(PROD_DIR)/tmp
	chmod 777 $(PROD_DIR)/tmp
	$(info ************ Installing dependencies **********)
	cd $(PROD_DIR) && composer install
	
copy-frontend-sources: copy-js-components minify
	$(info ************ Copying frontend sources **********)
	cp -r $(TMP_SRC_DIR)/webroot/img $(PROD_DIR)/webroot/img 
	cp -r $(TMP_SRC_DIR)/webroot/data $(PROD_DIR)/webroot/data 
	cp -r $(TMP_SRC_DIR)/webroot/js/lib $(PROD_DIR)/webroot/js/lib 
	cp -r $(TMP_SRC_DIR)/webroot/js/src $(PROD_DIR)/webroot/js/src 
	cp -r $(TMP_SRC_DIR)/webroot/css $(PROD_DIR)/webroot/css 
	$(info ************ Cleaning **********)
	cd $(PROD_DIR)/webroot/js/src && find . -type f -name '*.spec.js' -delete
	cd $(PROD_DIR)/webroot/js/src && find . -type f ! -name '*.min.js' ! -name '*.html' -delete
	cd $(PROD_DIR)/webroot/css && find . -type f ! -name '*.min.css' -delete
	
# TODO only copy build not all components
copy-js-components: copy-frontend-sources
	$(info ************ Copying js sources **********)
	cd $(TMP_SRC_DIR)/webroot/js && bower install && mkdir -p $(PROD_DIR)/webroot/js/components && cp -r components/* $(PROD_DIR)/webroot/js/components
	
	
##############################################################################
# Command to run to execute the YUI Compressor.
YUI_COMPRESSOR = java -jar $(TMP_SRC_DIR)/bin/yuicompressor.jar
UGLIFY_COMPRESSOR = uglifyjs 

# Flags to pass to the YUI Compressor for both CSS and JS.
YUI_COMPRESSOR_FLAGS = --charset utf-8 --verbose
UGLIFY_COMPRESSOR_FLAGS = --charset utf-8 --verbose

#CSS_MINIFIED = $(addprefix $CSS_OUTPUT, $(notdir $(CSS_FILES:.css=-min.css)))
#JS_MINIFIED = $(addprefix $JS_OUTPUT, $(JS_FILES:.js=-min.js)))
CSS_MINIFIED = $(CSS_FILES:.css=.min.css)
JS_MINIFIED = $(JS_FILES:.js=.min.js)

# target: minify - Minifies CSS and JS.
minify: minify-css minify-js

# target: minify-css - Minifies CSS.
minify-css: $(CSS_FILES) $(CSS_MINIFIED)

# target: minify-js - Minifies JS.
minify-js: $(JS_FILES) $(JS_MINIFIED)

%.min.css: %.css
	@echo '==> Minifying $<'
	$(YUI_COMPRESSOR) $(YUI_COMPRESSOR_FLAGS) --type css $< >$@
	@echo

%.min.js: %.js
	@echo '==> Minifying $<'
	$(UGLIFY_COMPRESSOR) $(UGLIFY_COMPRESSOR_FLAGS) --type js $< >$@
	@echo

# target: clean - Removes minified CSS and JS files.
clean:
	rm -f $(CSS_MINIFIED) $(JS_MINIFIED)

# target: help - Displays help.
help:
	@egrep "^# target:" Makefile
