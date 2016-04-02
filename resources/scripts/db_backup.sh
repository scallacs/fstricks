BACKUP_FOLDER = "~/backup/timapp/database"
#COMPRESSOR_BIN = "C:\Program Files\WinRar\rar.exe"
COMPRESSOR_BIN = "tar"
COMPRESSOR_FLAGS = "cfz $(BACKUP_FOLDER)/$(date +%Y-%m-%d).tar.gz"

# Database backup
mkdir -p $(BACKUP_FOLDER)
echo "r4xc3oSFSTDB" | mysqldump -u root -p timapp > "$(BACKUP_FOLDER)/tmp.sql"
$(COMPRESSOR_BIN ) $(COMPRESSOR_FLAGS) "$(BACKUP_FOLDER)/tmp.sql"
rm "$(BACKUP_FOLDER)/tmp.sql"

