# suffix will be ignored.
CSS_FILES = $(filter-out %.min.css,$(wildcard \
	webroot/css/*.css \
))
CSS_MINIFIED = $(CSS_FILES:.css=.min.css)
YUI_COMPRESSOR = java -jar bin/yuicompressor.jar
YUI_COMPRESSOR_FLAGS = --charset utf-8 --verbose
GULP_BIN = node_modules/gulp/bin/gulp.js
DB_SOURCE = resources/database/trickers.sql

###############################################################

# target: mv2prod - Moving to production
mv2prod: 
	rm -rf /var/www/html/*
	cp -r ./* /var/www/html
	cp .htaccess /var/www/html
	cp webroot/.htaccess /var/www/html/webroot
	sudo chmod 777 -R /var/www/html/logs
	sudo chmod 777 -R /var/www/html/tmp
	
# target: prod - build the project for production
prod: build clean-prod config-prod database


# target: dev - build the project for dev
dev: build database
	mv config/app.dev.php config/app.php

config-prod:
	mv config/app.prod.php config/app.php
	
.PHONY: database
database: $(DB_SOURCE)
	echo "CREATE DATABASE IF NOT EXISTS trickers" |  mysql -uroot -pr4xc3oSFSTDB -hlocalhost
	mysql -uroot -pr4xc3oSFSTDB -hlocalhost trickers < $(DB_SOURCE)
	
# target: clean-prod - cleaning prod server 
.PHONY: clean-prod
clean-prod:
	rm -rf webroot/coverage
	rm -rf webroot/js/e2e-tests
	find webroot/js/src -type f ! -name '*.html' -delete
	find webroot/css -type f ! -name '*.min.css' -delete

build: build-backend build-frontend minify

.PHONY: build-backend
build-backend: 
	composer install
	npm install
	
build-frontend: 
	bower install
	
###############################################################
# MINIFY

# minify : minify - test-frontend run test on backend
minify: minify-css minify-js
	
# target : minify-js
minify-js:
	$(GULP_BIN) concat-js
	
# target: minify-css - Minifies CSS.
minify-css: $(CSS_FILES) $(CSS_MINIFIED)
	
%.min.css: %.css
	@echo '==> Minifying $<'
	$(YUI_COMPRESSOR) $(YUI_COMPRESSOR_FLAGS) --type css $< >$@
	@echo
	
.PHONY: test-frontend
# target : - test-frontend run test on backend
test-frontend:
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