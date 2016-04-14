# .bashrc

# Source global definitions
if [ -f /etc/bashrc ]; then
        . /etc/bashrc
fi
WWW_PROD_DIR="/var/www/fstricks"
WWW_SCRIPT_DIR=$WWW_PROD_DIR/resources/scripts
chmod u+x $WWW_SCRIPT_DIR/*.sh
export PATH=$PATH:$WWW_SCRIPT_DIR
# User specific aliases and functions
alias gwww="cd /var/www/fstricks"
alias gh="cd /home/ec2-user"
alias edbash="vim ~/.bashrc"
alias rbash="source ~/.bashrc"
alias gbu="cd ~/backup/fstricks"
alias restart-server="sudo service httpd stop; sudo service httpd start"
alias start-snapshot="forever start -l ~/logs/snapshot-log.log -o ~/logs/snapshot-out.log -e ~/logs/snapshot-error.log ~/fstricks-prerender/server.js"

