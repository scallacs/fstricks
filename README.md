# Freestyle tricks
# @author: Stéphane Léonard
# @contact: sca.leonard@gmail.com

SOURCES:
git clone https://github.com/scallacs/tricker.git fstricks

INSTALLATION: 
composer install
cd webroot/js && bower install # For public
cd webroot/js && npm install # For dev dependencies

--------------------------------------------------------------------------------
RUNNING TESTS: 
Backend:
    vendor/bin/phpunit tests/TestCase [--filter="name"]
    COVERAGE: vendor/bin/phpunit --coverage-html webroot/coverage tests/TestCase
    VIEW: webroot/coverage/index.html 

--------------------------------------------------------------------------------
Frontend
    cd webroot/js
    karma start
    karma run 

--------------------------------------------------------------------------------
E2E tests

[require] npm install -g protractor
[required] webdriver-manager update

webdriver-manager start
protractor protractor.conf.js
