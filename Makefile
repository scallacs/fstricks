# suffix will be ignored.
CSS_FILES = $(filter-out %.min.css,$(wildcard \
	webroot/css/*.css \
))
CSS_MINIFIED = $(CSS_FILES:.css=.min.css)
GULP_BIN = node_modules/gulp/bin/gulp.js
DB_SOURCE = resources/database/prod.sql
DB_PROD_NAME = trickers 
DB_DEV_NAME = trickers
DB_TEST_NAME = trickers_test_e2e
 
DB_DEV_CREDENTIAL = -uroot -hlocalhost -hlocalhost
DB_TEST_CREDENTIAL = -uroot -hlocalhost -hlocalhost
DB_PROD_CREDENTIAL = -uroot -pr4xc3oSFSTDB -hlocalhost

KARMA_BIN = node_modules/karma/bin/karma
WEBDRIVER_MANAGER_BIN = node_modules/webdriver-manager/bin/webdriver-manager
PROTRACTOR_BIN = node_modules/protractor/bin/protractor
###############################################################
# target: reset-repo - reset repo
reset-repo: 
	git reset --hard origin/master
#	git fetch origin

# target: mv2prod - Moving to production
mv2prod: 
	sudo rm -rf /var/www/html/*
	cp -r ./* /var/www/html
	cp .htaccess /var/www/html
	cp webroot/.htaccess /var/www/html/webroot
	sudo chmod 777 -R /var/www/html/logs
	sudo chmod 777 -R /var/www/html/tmp
	
# target: prod - build the project for production
prod: build clean-prod config-prod 


# target: dev - build the project for dev
config-dev: build 
	cp config/app.dev.php config/app.php

config-prod:
	cp config/app.prod.php config/app.php
	
config-test:
	cp config/app.test.php config/app.php
	
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
	find webroot/js/admin -type f ! -name '*.html' -delete
	find webroot/js/src -type f ! -name '*.html' -delete
	find webroot/css -type f ! -name 'style.css' -delete

build: reset-repo build-backend build-frontend minify

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
	$(GULP_BIN) concat-js-admin

	
# target: minify-css - Minifies CSS.
minify-css:
	$(GULP_BIN) concat-css
		
	
###############################################################
# TESTS

tests: test-backend test-frontend

test-controller: 
	vendor/bin/phpunit --coverage-html webroot/coverage tests/TestCase/Controller/$(q)ControllerTest.php

start-webdriver:
	$(WEBDRIVER_MANAGER_BIN) start 
	
# target : - test-frontend run test on backend 
.PHONY: test-frontend
test-frontend: config-test
	mysql $(DB_TEST_CREDENTIAL) $(DB_TEST_NAME) < './resources/database/test/delete.sql'
	mysql $(DB_TEST_CREDENTIAL) $(DB_TEST_NAME) < './resources/database/test/insert.sql'
	$(PROTRACTOR_BIN) webroot/js/e2e-tests/conf/protractor-conf.js


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