PROJECT_NAME=Timapp
USERNAME=ec2-user
SERVER_NAME=ssh.timappweb.com
# Create git folder
ssh://$(USERNAME)@$(SERVER_NAME)/home/$(USERNAME)/$(PROJECT_NAME).git
mkdir /home/$(USERNAME)/$(PROJECT_NAME).git
cd /home/$(USERNAME)/$(PROJECT_NAME).git
git init --bare

# Client side

ssh-add /private/key/path # add private key 
git remote add origin ssh://$(USERNAME)@$(SERVER_NAME)/home/$(USERNAME)/$(PROJECT_NAME).git
git push origin master 


# Cloning in production 
git clone /home/$(USERNAME)/$(PROJECT_NAME).git /var/www/Production

# Creating hook
cp post-update /home/$(USERNAME)/$(PROJECT_NAME).git/hooks/
chmod uog+x /home/$(USERNAME)/$(PROJECT_NAME).git/hooks/post-update

# Util
git remote set-url --add --push origin ssh://ec2-user@fstricks.com/home/ec2-user/fstricks.git
git remote set-url --add --push origin  https://github.com/scallacs/Tricker.git
git remote -v
