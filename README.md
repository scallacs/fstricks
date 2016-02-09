# Freestyle tricks
# @author: Stéphane Léonard
# @contact: sca.leonard@gmail.com

RUNNING TESTS: 
Backend:
    vendor/bin/phpunit tests/TestCase [--filter="name"]

Frontend
    cd webroot/js
    karma start
    karma run 

E2E tests
--------------------------------------------------------------------------------
[require] npm install -g protractor
[required] webdriver-manager update

webdriver-manager start
protractor protractor.conf.js
