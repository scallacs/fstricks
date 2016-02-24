# Log to server
ssh -i resources/webserver-fstricks-linux.pem ec2-user@ec2-52-36-163-153.us-west-2.compute.amazonaws.com

# Setting file perms
cd /var/www
sudo groupadd www
sudo usermod -a -G www ec2-user
exit
ssh -i resources/webserver-fstricks-linux.pem ec2-user@ec2-52-36-163-153.us-west-2.compute.amazonaws.com

# Change group ownership
sudo chown -R root:www /var/www
sudo chmod 2775 /var/www
# Change the directory permissions of /var/www and its subdirectories to add group write permissions and to set the group ID on future subdirectories.
find /var/www -type d -exec sudo chmod 2775 {} \;
# Recursively change the file permissions of /var/www and its subdirectories to add group write permissions.
find /var/www -type f -exec sudo chmod 0664 {} \;
#Now ec2_user (and any future members of the www group) can add, delete, and edit files in the Apache document root. 
# Now you are ready to add content, such as a static website or a PHP application.

#If any of the required packages are not listed in your output, install them with the sudo yum install package command.

# MYSQL 
sudo service mysqld start
sudo mysql_secure_installation

 sudo chkconfig mysqld on # start mysql server at every boot
 
#Enable the Extra Packages for Enterprise Linux (EPEL) repository from the Fedora project on your instance.
sudo yum-config-manager --enable epel
#Install the phpMyAdmin package.
sudo yum install -y phpMyAdmin
# Authorize connection to php my admin from this ip: 
sudo sed -i -e 's/127.0.0.1/78.233.201.181/g' /etc/httpd/conf.d/phpMyAdmin.conf
sudo service httpd restart



#### TOOLS ############
#Composer
php -r "readfile('https://getcomposer.org/installer');" > composer-setup.php
php -r "if (hash('SHA384', file_get_contents('composer-setup.php')) === 'fd26ce67e3b237fffd5e5544b45b0d92c41a4afe3e3f778e942e43ce6be197b9cdc7c251dcde6e2a52297ea269370680') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); }"
php composer-setup.php
php -r "unlink('composer-setup.php');"
sudo mv composer.phar /usr/local/bin/composer

sudo yum install npm
sudo npm install bower -g
sudo npm install uglify-js -g






