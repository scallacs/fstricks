# suffix will be ignored.
CSS_FILES = $(filter-out %.min.css,$(wildcard \
	webroot/css/*.css \
))

NODE_MODULES_PATH = jsapp/node_modules
GULP_BIN = node_modules/gulp/bin/gulp.js
DB_SOURCE = resources/database/prod.sql
DB_PROD_NAME = trickers 
DB_DEV_NAME = trickers
DB_TEST_NAME = trickers_test_e2e
 
DB_DEV_CREDENTIAL = -uroot -hlocalhost -hlocalhost
DB_TEST_CREDENTIAL = -uroot -hlocalhost -hlocalhost
DB_PROD_CREDENTIAL = -uroot -pr4xc3oSFSTDB -hlocalhost

KARMA_BIN = $(NODE_MODULES_PATH)/karma/bin/karma
WEBDRIVER_MANAGER_BIN = $(NODE_MODULES_PATH)/webdriver-manager/bin/webdriver-manager
PROTRACTOR_BIN = $(NODE_MODULES_PATH)/protractor/bin/protractor


###############################################################
# BUILD
###############################################################
all: build
    
build: reset-repo build-backend build-frontend
	
.PHONY: build-backend	
build-backend: 
	chmod u+x bin/cake
	composer install --no-interaction
	chmod 777 -R tmp/*
	cd jsapp && npm install
	
clear-cache: 
	sudo rm -rf tmp/* 
# target: reset-repo - reset repo
reset-repo: 
	git reset --hard origin/master
#	git fetch origin

	
# target: prod - build the project for production
prod: clear-cache build clean-prod

# target: uat - build the project for production
uat: build
	
# target: dev - build the project for production
dev: build

.PHONY: database
database: $(DB_SOURCE)
	echo "CREATE DATABASE IF NOT EXISTS $(DB_PROD_NAME)" |  mysql $(DB_PROD_CREDENTIAL)
	mysql $(DB_PROD_CREDENTIAL) $(DB_PROD_NAME) < $(DB_SOURCE)
	

# TODO use constants
.PHONY: build-frontend
build-frontend:  
	bin/cake AngularConfig http://www.fstricks.com 
	bower install 
	cd jsapp && $(GULP_BIN) build 

.PHONY: generate-sitemap
generate-sitemap: 
        bin/cake Sitemap http://www.fstricks.com

clean-prod:
	rm -rf webroot/coverage

###############################################################
# TESTS

# Test Integration 
test-all: test-unit test-integration
	
.PHONY: test-integration
test-integration:
    vendor/bin/phpunit --coverage-html webroot/coverage tests/TestCase/Controller/$(q)ControllerTest.php

.PHONY: test-unit
test-unit:
    vendor/bin/phpunit --coverage-html webroot/coverage tests/TestCase/Controller/$(q)ControllerTest.php

.PHONY: test-backend
test-backend: config-test
	vendor/bin/phpunit --coverage-html webroot/coverage tests/TestCase | tee -i logs/test-backend.log

###############################################################
# UI
start-webdriver:
	$(WEBDRIVER_MANAGER_BIN) update --ie 
	$(WEBDRIVER_MANAGER_BIN) start 
	
init-db-tests:
	mysql $(DB_TEST_CREDENTIAL) $(DB_TEST_NAME) < './resources/database/test/delete.sql'
	mysql $(DB_TEST_CREDENTIAL) $(DB_TEST_NAME) < './resources/database/test/insert.sql'

# target : - test-frontend run test on backend 
.PHONY: test-frontend
ifdef s
test-frontend: config-test init-db-tests
	$(PROTRACTOR_BIN) jsapp/tests/e2e-tests/conf/protractor-conf.js $(q) --specs jsapp/tests/e2e-tests/$(s).spec.js | tee -i logs/test-frontend.log
endif
ifndef s

s="--specs jsapp/tests/e2e-tests/$(s).spec.js"
test-frontend: config-test init-db-tests
	$(PROTRACTOR_BIN) jsapp/tests/e2e-tests/conf/protractor-conf.js $(q) | tee -i logs/test-frontend.log
endif


# Init db 
prepare-db:
	cp config/app.dev.php config/app.php
	echo "DROP DATABASE $(DB_DEV_NAME); CREATE DATABASE $(DB_DEV_NAME)" |  mysql $(DB_DEV_CREDENTIAL)
	mysql $(DB_DEV_CREDENTIAL) $(DB_DEV_NAME) < $(DB_SOURCE) 
	

# target: help - Displays help.
help:
	@egrep "^# target:" Makefile
