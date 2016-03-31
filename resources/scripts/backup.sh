BACKUP_FOLDER = "~/backup/timapp/database"
COMPRESSOR_BIN = "C:\Program Files\WinRar\rar.exe"

# Database backup
mkdir -p $(BACKUP_FOLDER)
echo "r4xc3oSFSTDB" | mysqldump -u root -p timapp > "$(BACKUP_FOLDER)/tmp.sql"
$(COMPRESSOR_BIN ) a -agyyyy-MM-dd -r "$(BACKUP_FOLDER)" "$(BACKUP_FOLDER)/tmp.sql"

