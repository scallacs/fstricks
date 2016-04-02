BACKUP_FOLDER="~/backup/fstricks/logs"
#COMPRESSOR_BIN = "C:\Program Files\WinRar\rar.exe"
COMPRESSOR_BIN="tar"
COMPRESSOR_FLAGS="cfzv ${BACKUP_FOLDER}/$(date +%Y-%m-%d).tar.gz"
LOGS_FOLDER="/var/www/fstricks/logs"

echo "Creating backup folder: $BACKUP_FOLDER"
# Database backup
mkdir -p $BACKUP_FOLDER
${COMPRESSOR_BIN} ${COMPRESSOR_FLAGS} ${LOGS_FOLDER}
rm -rf ${LOGS_FOLDER}/*
echo "Logs archiving done!"
