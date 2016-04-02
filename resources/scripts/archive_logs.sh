BACKUP_FOLDER="~/backup/fstricks/logs"
#COMPRESSOR_BIN = "C:\Program Files\WinRar\rar.exe"
COMPRESSOR_BIN="tar"
COMPRESSOR_FLAGS="cfz ${BACKUP_FOLDER}/$(date +%Y-%m-%d).tar.gz"
LOGS_FOLDER="/var/etc/fstricks/logs"

# Database backup
mkdir -p ${BACKUP_FOLDER}
${COMPRESSOR_BIN} ${COMPRESSOR_FLAGS} ${LOGS_FOLDER}
rm -rf ${LOGS_FOLDER}/*