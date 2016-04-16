# suffix will be ignored.
CSS_FILES = $(filter-out %.min.css,$(wildcard \
	webroot/css/*.css \
))

NODE_MODULES_PATH = jsapp/node_modules
GULP_BIN = $(NODE_MODULES_PATH)/gulp/bin/gulp.js
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
all: build mv2prod
    
clear-cache: 
	sudo rm -rf tmp/* 
	echo "Y" | composer install

# target: reset-repo - reset repo
reset-repo: 
	git reset --hard origin/master
#	git fetch origin

	
# target: prod - build the project for production
prod: clear-cache build config-prod clean-prod

# target: uat - build the project for production
uat: build config-uat

# target: dev - build the project for production
dev: build config-dev


# target: dev - build the project for dev
config-dev: build 
	cp config/app.dev.php config/app.php

config-prod:
	cp config/app.prod.php config/app.php
	
config-test:
	cp config/app.test.php config/app.php

config-uat:
	cp config/app.uat.php config/app.php
	
.PHONY: database
database: $(DB_SOURCE)
	echo "CREATE DATABASE IF NOT EXISTS $(DB_PROD_NAME)" |  mysql $(DB_PROD_CREDENTIAL)
	mysql $(DB_PROD_CREDENTIAL) $(DB_PROD_NAME) < $(DB_SOURCE)
	
build: reset-repo build-backend build-frontend

.PHONY: build-backend
build-backend: 
	chmod u+x bin/cake
	composer install
	cd jsapp && npm install
	
# TODO use constants
.PHONY: build-frontend
build-frontend:  
	cake AngularConfig http://www.fstricks.com 
	bower install 
	cd jsapp && $(GULP_BIN) build 

.PHONY: generate-sitemap
generate-sitemap: 
        bin/cake Sitemap http://www.fstricks.com

clean-prod:
	rm -rf webroot/coverage

###############################################################
# TESTS

tests: test-backend test-frontend

test-controller: config-test
	vendor/bin/phpunit --coverage-html webroot/coverage tests/TestCase/Controller/$(q)ControllerTest.php

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
	
# target : - test-backend run test on backend
.PHONY: test-backend
test-backend: config-test
	vendor/bin/phpunit --coverage-html webroot/coverage tests/TestCase | tee -i logs/test-backend.log

# target: help - Displays help.
help:
	@egrep "^# target:" Makefile




# target: mv2prod - Moving to production
#mv2prod: 
#	sudo rm -rf /var/www/html/*
#	cp -r ./* /var/www/html
#	cp .htaccess /var/www/html
#	cp webroot/.htaccess /var/www/html/webroot
#	sudo chmod 777 -R /var/www/html/logs
#	sudo chmod 777 -R /var/www/html/tmp
# target: clean-prod - cleaning prod server 
#.PHONY: clean-prod
#clean-prod:
#	rm -rf webroot/coverage
#	rm -rf webroot/js/lib
#	find webroot/js/admin -type f ! -name '*.html' -delete
#	find webroot/js/src -type f ! -name '*.html' -delete
#	find webroot/css -type f ! -name 'style.css' -delete
