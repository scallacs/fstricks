# suffix will be ignored.
CSS_FILES = $(filter-out %.min.css,$(wildcard \
	webroot/css/*.css \
))
CSS_MINIFIED = $(CSS_FILES:.css=.min.css)
GULP_BIN = node_modules/gulp/bin/gulp.js
DB_SOURCE = resources/database/trickers.sql
DB_PROD_NAME = trickers 
# For end to end tests
DB_DEV_NAME = trickers
 
DB_DEV_CREDENTIAL = -uroot -hlocalhost -hlocalhost
DB_PROD_CREDENTIAL = -uroot -pr4xc3oSFSTDB -hlocalhost

KARMA_BIN = node_modules/karma/bin/karma
WEBDRIVER_MANAGER_BIN = node_modules/webdriver-manager/bin/webdriver-manager
PROTRACTOR_BIN = node_modules/protractor/bin/protractor
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
prod: build clean-prod config-prod 

# target: reset-repo - reset repo
reset-repo:
    git fetch origin
    git reset --hard origin/master

# target: dev - build the project for dev
dev: build 
	cp config/app.dev.php config/app.php

config-prod:
	cp config/app.prod.php config/app.php
	
.PHONY: database
database: $(DB_SOURCE)
	echo "CREATE DATABASE IF NOT EXISTS $(DB_PROD_NAME)" |  mysql $(DB_PROD_CREDENTIAL)
	mysql $(DB_PROD_CREDENTIAL) $(DB_PROD_NAME) < $(DB_SOURCE)
	
# target: clean-prod - cleaning prod server 
.PHONY: clean-prod
clean-prod:
	rm -rf webroot/coverage
	rm -rf webroot/js/e2e-tests
	rm -rf webroot/js/components
	rm -rf webroot/js/lib
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
	$(GULP_BIN) concat-js-components
	$(GULP_BIN) concat-js-lib
	
# target: minify-css - Minifies CSS.
minify-css:
	$(GULP_BIN) concat-css
		
	
###############################################################
# TESTS

tests: test-backend test-frontend
	

start-webdriver:
	$(WEBDRIVER_MANAGER_BIN) start 
	
# target : - test-frontend run test on backend 
.PHONY: test-frontend
test-frontend: 
	$(PROTRACTOR_BIN) webroot/js/e2e-tests/protractor-conf.js


# Init db 
prepare-db:
	cp config/app.dev.php config/app.php
	echo "DROP DATABASE $(DB_DEV_NAME); CREATE DATABASE $(DB_DEV_NAME)" |  mysql $(DB_DEV_CREDENTIAL)
	mysql $(DB_DEV_CREDENTIAL) $(DB_DEV_NAME) < $(DB_SOURCE) 
	
# target : - test-backend run test on backend
.PHONY: test-backend
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