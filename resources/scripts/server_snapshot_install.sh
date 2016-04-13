sudo npm install forever -g 

cd /var/www/
git clone https://github.com/prerender/prerender.git fstricks-prerender
cd fstricks-prerender
sudo npm install

# TODO checkports:
cat lib/index.js

forever start server.js

##
sudo rpm -Uvh https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
sudo rpm -Uvh https://mirror.webtatic.com/yum/el7/webtatic-release.rpm
echo "y" | sudo yum --enablerepo=remi,remi-test install redis

#Then enable the Redis service to start on boot:
sudo service redis start
#sudo service redis stop
#You should then check the Redis status:
# TODO check equals to PONG
sudo redis-cli ping

###http://stackoverflow.com/questions/21564993/native-support-for-promises-in-node-js
sudo npm install prerender-redis-cache --save
echo "process.env.PAGE_TTL = 3600 * 24 ;" >> server.js
echo "server.use(require('prerender-redis-cache'));" >> server.js
npm install es6-promise
echo "var Promise = require("es6-promise").Promise;" >> server.js


forever stopall
forever start server.js

# clear cache: 
# redis-cli -p 6379 flushall