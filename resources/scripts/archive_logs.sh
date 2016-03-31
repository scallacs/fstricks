BACKUP_FOLDER = "~/backup/timapp/logs"
COMPRESSOR_BIN = "C:\Program Files\WinRar\rar.exe"
LOGS_FOLDER = "/var/etc/fstricks/logs"

# Database backup
mkdir -p $(BACKUP_FOLDER)
$(COMPRESSOR_BIN) a -agyyyy-MM-dd -r $(BACKUP_FOLDER) $(LOGS_FOLDER)
rm -r $(LOGS_FOLDER)/*