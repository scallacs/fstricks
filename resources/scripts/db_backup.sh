cd ~
BACKUP_FOLDER=backup/fstricks/database
#COMPRESSOR_BIN = "C:\Program Files\WinRar\rar.exe"
COMPRESSOR_BIN="tar"
COMPRESSOR_FLAGS="cfz ${BACKUP_FOLDER}/$(date +%Y-%m-%d).tar.gz"

# Database backup

echo "Creating db backup in folder: $BACKUP_FOLDER"
mkdir -p ${BACKUP_FOLDER}
mysqldump -u root -pr4xc3oSFSTDB trickers > "${BACKUP_FOLDER}/tmp.sql"
${COMPRESSOR_BIN} ${COMPRESSOR_FLAGS} "${BACKUP_FOLDER}/tmp.sql"
rm "${BACKUP_FOLDER}/tmp.sql"
echo "Db backup done"
