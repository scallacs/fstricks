# suffix will be ignored.
CSS_FILES = $(filter-out %.min.css,$(wildcard \
	$(TMP_SRC_DIR)/webroot/css/*.css \
	$(TMP_SRC_DIR)/webroot/css/**/*.css \
))
YUI_COMPRESSOR = java -jar bin/yuicompressor.jar
YUI_COMPRESSOR_FLAGS = --charset utf-8 --verbose

###############################################################

# target: prod - build the project for production
prod: build clean-prod
	mv config/app.prod.php config/app.php

# target: dev - build the project for dev
dev: build
	mv config/app.dev.php config/app.php

# target: clean-prod - cleaning prod server 
clean-prod:
	rm -rf webroot/coverage
	rm -rf webroot/js/e2e-tests
	find webroot/js/src -type f ! -name '*.html' -delete

build: composer npm bower minify

composer: 
	composer install

npm: 
	npm install
	
bower: 
	bower install
	
###############################################################
# MINIFY

# minify : - test-frontend run test on backend
minify: minify-css minify-js
	
minify-js:
	gulp concat-js
	
# target: minify-css - Minifies CSS.
minify-css: $(CSS_FILES) $(CSS_MINIFIED)
	
CSS_MINIFIED = $(CSS_FILES:.css=.min.css)
%.min.css: %.css
	@echo '==> Minifying $<'
	$(YUI_COMPRESSOR) $(YUI_COMPRESSOR_FLAGS) --type css $< >$@
	@echo
	
.PHONY: test-frontend
# target : - test-frontend run test on backend
test-frontend
	cd webroot/js && karma start && karma run 
	
###############################################################
# TESTS

.PHONY: test-backend
# target : - test-backend run test on backend
test-backend:
    vendor/bin/phpunit --coverage-html webroot/coverage tests/TestCase
    #webroot/coverage/index.html 
	

###############################################################
# OTHERS
# target: clean - Removes minified CSS and JS files.
clean:
	rm -f $(CSS_MINIFIED)
	
# target: help - Displays help.
help:
	@egrep "^# target:" Makefile