import { contextBridge, ipcRenderer, clipboard  } from 'electron'
// Añadir eventos de progreso
ipcRenderer.on('copy-progress', (event, message) => {
  // Emitir el evento al frontend
  window.dispatchEvent(new CustomEvent('copy-progress', { detail: message }));
});

// Eliminar el listener de progreso
function removeCopyProgressListener() {
  ipcRenderer.removeAllListeners('copy-progress');
}

// Exponer APIs específicas de tu aplicación
contextBridge.exposeInMainWorld('api', {
  ipcRenderer: ipcRenderer,
  //actualizaciones
  onUpdateDownloadProgress: (callback) => ipcRenderer.on('update-download-progress', (event, percent) => callback(percent)),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
  //obtener ruta base
  getBasePath: () => ipcRenderer.invoke('get-base-path'),
  //obtener mods
  getMods: () => ipcRenderer.invoke('get-mods'),
  //ejecutar mod
  runMod: (selectedMod) => ipcRenderer.invoke('run-mod', selectedMod),
  onModExecutionEnded: (callback) => ipcRenderer.on('mod-execution-ended', callback),
  //obtener datos de ejecucion
  getEjecucion: (selectedMod) => ipcRenderer.invoke('get-ejecucion', selectedMod),
  //abrir archivos persistentes
  openFolderPersistent: () => ipcRenderer.invoke('open-folder-persistent'),
  //abrir carpeta raiz
  openFolderRaiz: () => ipcRenderer.invoke('open-folder-raiz'),
  //eliminar archivo config
  deleteFileConfig: () => ipcRenderer.invoke('delete-config-json'),
  //abrir carpeta mod
  openFolderMod: (ruta) => ipcRenderer.invoke('open-folder-mod', ruta),
  //crear carpeta de mod
  createModFolder: (foldername) => ipcRenderer.invoke('create-mod-folder', foldername),
  //cambiar de ruta
  createNewFolderRute: (newRute) => ipcRenderer.invoke('create-new-folder-rute', newRute),
  changeRuteConfig: (newRuteConfig) => ipcRenderer.invoke('new-file-config-change', newRuteConfig),
  //copiar archivos ddlc base a mod
  copyFolder: (paths) => ipcRenderer.invoke('copy-folder', paths),
  //copiar archivos de mod a carpeta creada de mod
  copyModFolder: (paths) => ipcRenderer.invoke('copy-mod-folder', paths),
  
  onCopyProgress: (callback) => ipcRenderer.on('copy-progress', (event, progress) => callback(progress)),
  removeCopyProgressListener: () => ipcRenderer.removeAllListeners('copy-progress'),

  //Seleccionar archivos o carpeta
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  selectImg: ()=> ipcRenderer.invoke('select-img'),
  selectZip: () => ipcRenderer.invoke('select-zip-file'),
  // Función para pegar desde el portapapeles
  pasteClipboard: () => clipboard.readText(),
  //Detectar DDLC
  checkFolderExists: async () => {
    return await ipcRenderer.invoke('check-folder-exists');
  },
  //detectar .bat 
  checkBatExists: async (url_bat) => {
    return await ipcRenderer.invoke('check-bat-exists', url_bat);

  }
  //Extrasion de DDLC
  ,extractAndMoveZip: async (zipFilePath) => {
    return await ipcRenderer.invoke('extract-and-move-zip', zipFilePath);
  },
  onExtractProgress: (callback) => ipcRenderer.on('extract-progress', (event, progress) => callback(progress)),
  removeExtractProgressListener: () => ipcRenderer.removeAllListeners('extract-progress'),
  // Función para cerrar la aplicación
  closeApp: () => ipcRenderer.send('close-app'),

  // Método para solicitar la descarga de un archivo
  downloadFile: (fileUrl) => ipcRenderer.send('download-file', fileUrl),
  cancelDownload: () => ipcRenderer.send('cancel-download'), // Envía la señal para cancelar
   // Agregar el listener para download-cancelled
   onDownloadCancelled: (callback) => ipcRenderer.on('download-cancelled', (event, message) => callback(message)),
  // Manejar el progreso de la descarga
  onDownloadError: (callback) => ipcRenderer.on('download-error', callback),
  onUnzipError: (callback) => ipcRenderer.on('unzip-error', callback),
  onDownloadComplete: (callback) => ipcRenderer.on('download-complete', callback),
  onDownloadProgress: (callback) => ipcRenderer.on('download-progress', callback),
  onExtractionComplete: (callback) => ipcRenderer.on('extraction-complete', callback),
  //eliminar carpeta o archivo
  deleteFolderOrFile: (filePath) => ipcRenderer.invoke('delete-folder-or-file', filePath),
  
  //revisar espacio en disco
  checkDiskSpace: (drivePath) => ipcRenderer.invoke('check-disk-space', drivePath),
  //Crear .bat del mod
  crearBatFile: (folderPath, exeFileName) => ipcRenderer.invoke('crear-bat-file', folderPath, exeFileName),
  //ejcutar el .bat
})

contextBridge.exposeInMainWorld('electron', {
  runBatFile: (batFilePath) => ipcRenderer.invoke('run-bat-file', batFilePath),
  updateDiscordStatus: (details, state, ddlc_icon) => {
    ipcRenderer.send('update-discord-status', { details, state, ddlc_icon});
  },
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  createFilesName: (namePlayer) => ipcRenderer.invoke('create-files-name', namePlayer)
});


// Custom APIs for renderer
const api = {}



