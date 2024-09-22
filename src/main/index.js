import { app, shell, BrowserWindow, ipcMain, dialog, Notification,net, nativeImage  } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import fsExtra from 'fs-extra'
import { spawn } from 'child_process'
import os from 'os'
import { autoUpdater } from 'electron-updater'
import unzipper from 'unzipper';
const { exec } = require('child_process'); // Asegúrate de importar 'exec' aquí
//obtener la libreria para revisar el espacio en disco
const checkDiskSpace = require('check-disk-space').default;


//integración con discord
const { Client } = require('discord-rpc');

const clientId = '1287078808893128764';

const rpc = new Client({ transport: 'ipc' });

async function setActivity(details, state, ddlc_icon) {
  if (!rpc) {
    return;
  }

  rpc.setActivity({
    details: details || '...',
    state: state || 'Esperando actividad :D',
    startTimestamp: Date.now(),
    largeImageKey: 'logo',
    largeImageText: 'DDSC Launcher',
    smallImageKey: ddlc_icon || 'logo',
    smallImageText: details || 'Inicio',
    instance: false,
  });

}

rpc.on('ready', () => {
  console.log('Discord RPC listo.');
  setActivity();

  // Actualizar cada 15 segundos
  /*
  setInterval(() => {
    setActivity();
  }, 15 * 1000);
  */
});

rpc.login({ clientId }).catch(console.error);

//obtener datos del package.json (version)
const packageJson = require('./../../package.json');

// Ruta del archivo de configuración
const configPath = join(app.getPath('userData'), 'config.json');

// Función para obtener la ruta base desde config.json
async function getBasePath() {
  if (fsExtra.existsSync(configPath)) {
    const config = JSON.parse(fsExtra.readFileSync(configPath, 'utf8'));
    return config.folderPath || 'C:'; // Valor por defecto si no se encuentra la ruta
  } else {
    // Mostrar diálogo de selección de carpeta si el archivo de configuración no existe
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      defaultPath: 'C:\\' // Establece la ruta por defecto en C:
    });
    
    if (result.canceled) {
      throw new Error('La selección de carpeta fue cancelada.');
    }
    const baseFolderPath = result.filePaths[0];
    const finalFolderPath = join(baseFolderPath, 'DDSC_Launcher');
    // Guardar la ruta en el archivo de configuración
    const config = { folderPath: finalFolderPath };
    fsExtra.writeFileSync(configPath, JSON.stringify(config), 'utf8');
    
    // Asegúrate de que la carpeta 'DDSC_Launcher' exista
    if (!fsExtra.existsSync(finalFolderPath)) {
        await fsExtra.ensureDir(finalFolderPath);
    }
    // Asegúrate de que la carpeta 'mods' exista
    if (!fsExtra.existsSync(join(finalFolderPath,"mods"))) {
      // Crear carpetas necesarias si no existen
        await fsExtra.ensureDir(join(finalFolderPath,"mods"));
        console.log(`Directorio de mod creado: ${modsPath}`);
    }
    
    return finalFolderPath;
  }
}

// Función para crear el archivo .bat de forma dinámica
async function crearBatFile(folderPath, ruta_ejecutar, exeFileName) {

  const batFilePath = join(folderPath, 'iniciar_mod.bat');
  const batContent = `cd ${ruta_ejecutar}\\DDLC-1.1.1-pc\nstart ${exeFileName}`;

  try {
    // Verificar si el archivo .bat ya existe
    if (fsExtra.existsSync(batFilePath)) {
      console.log('El archivo .bat ya existe, no se creará de nuevo.');
      return { success: true, message: 'El archivo .bat ya existe', batFilePath };
    }

    // Crear el archivo .bat si no existe
    await fsExtra.writeFile(batFilePath, batContent, 'utf8');
    console.log('Archivo .bat creado con éxito');
    return { success: true, batFilePath };

  } catch (error) {
    console.error('Error al crear el archivo .bat:', error);
    return { success: false, error: error.message };
  }
}

//funcion para eliminar archivos
async function deleteFolderOrFile(filePath) {
  try {
    // Comprueba si el archivo o carpeta existe
    const exists = await fsExtra.pathExists(filePath);
    if (!exists) {
      return { success: false, message: 'La ruta especificada no existe' };
    }

    // Intenta eliminar el archivo o carpeta
    await fsExtra.remove(filePath);
    return { success: true, message: 'Eliminado correctamente' };
  } catch (error) {
    console.error('Error al eliminar:', error);

    // Reintenta la eliminación después de un breve retardo si hay un error ENOTEMPTY
    if (error.code === 'ENOTEMPTY') {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Retardo de 1 segundo
      try {
        await fsExtra.remove(filePath);
        return { success: true, message: 'Eliminado correctamente tras reintento' };
      } catch (retryError) {
        console.error('Error al eliminar en el reintento:', retryError);
        return { success: false, message: `Error al eliminar en el reintento: ${retryError.message}` };
      }
    }

    return { success: false, message: `Error al eliminar: ${error.message}` };
  }
}

//Creación de ventana
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,      // Ancho inicial
    height: 700,     // Alto inicial
    minWidth: 1000,   // Ancho mínimo
    minHeight: 700,
    show: false,
    autoHideMenuBar: true,
    icon: nativeImage.createFromPath(join(app.getAppPath(), 'public/Logo_DDSC-ico.ico')),// Ruta basada en app.getAppPath()
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      enableRemoteModule: true,
      valueOfwebSecurity: false,
    },
    title: `Doki Doki Spanish Club Launcher - v${packageJson.version}`,
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // Maximizar la ventana después de cargarla
  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  autoUpdater.checkForUpdatesAndNotify(); // Verifica actualizaciones
  //si existe una actualización
  autoUpdater.on('update-available', (info) => {
      // Bloquear la ventana de la aplicación mientras se descarga
      mainWindow.setEnabled(false);
      autoUpdater.downloadUpdate();
  });
  //si la actualización fue descargada
  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      buttons: ['Reinciar'],
      title: 'Actualización Completada',
      message: 'Actualización descargada y lista para instalar.',
      detail: 'La aplicación se reiniciará ahora para aplicar los cambios.'
    }).then(() => {
      autoUpdater.quitAndInstall();
    });
  });

  //mostrar progreso de descarga para actualizaciones
  autoUpdater.on('download-progress', (progressObj) => {
    const percent = Math.round(progressObj.percent);
    mainWindow.webContents.send('update-download-progress', percent);
  });

  // Ocultar el menú
  // mainWindow.setMenu(null);
  // Responde con la versión de la aplicación cuando se solicita
  ipcMain.handle('get-app-version', () => {
    return app.getVersion();
  });
}

app.whenReady().then(() => {
  createWindow();
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }

  electronApp.setAppUserModelId('com.electron')

 

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Configuración del manejador de eventos
  ipcMain.on('close-app', () => {
    app.quit(); // Cierra la aplicación
  });
  // Escuchar mensajes del renderer para actualizar el estado de Discord
  ipcMain.on('update-discord-status', (event, { details, state , url_details_mod}) => {
    setActivity(details, state, url_details_mod);
  });

  
    // Escucha para verificar el espacio en disco
  ipcMain.handle('check-disk-space', async (event, drivePath) => {
    try {
      const diskSpace = await checkDiskSpace(drivePath); // Por ejemplo, 'C:/'
      return {
        free: diskSpace.free,
        size: diskSpace.size,
      };
    } catch (error) {
      console.error('Error al verificar el espacio en disco:', error);
      return { error: 'Error al verificar el espacio en disco' };
    }
  });

  //detectar si existe las carpeta para notificar en el front-end
  ipcMain.handle('check-folder-exists', async () => {
    const basePath = await getBasePath(); // Define tu base path según tu configuración
    const folderPath = join(basePath, "DDLC-1.1.1-pc");

    return fsExtra.existsSync(folderPath); 
  });
  //detectar si existe el archivo .bat para notificar en el front-end
  ipcMain.handle('check-bat-exists', async (event, ruta_bat) => {
    const basePath = await getBasePath(); // Define tu base path según tu configuración
    const folderPath = join(basePath, ruta_bat);

    return fsExtra.existsSync(folderPath); 
  });

  // Handler para ejecutar el archivo .bat
ipcMain.handle('run-bat-file', async (event, batFilePath) => {
  try {
    if (fsExtra.existsSync(batFilePath)) {
      // Ejecutar el archivo .bat
      exec(`start "" "${batFilePath}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error al ejecutar el archivo .bat: ${error.message}`);
          return { success: false, error: error.message };
        }
        console.log(`Archivo .bat ejecutado: ${stdout}`);
        return { success: true };
      });
    } else {
      return { success: false, error: 'El archivo .bat no existe.' };
    }
  } catch (err) {
    console.error('Error al ejecutar el archivo .bat:', err);
    return { success: false, error: err.message };
  }
  })

  // Función para eliminar carpetas y archivos
  ipcMain.handle('delete-folder-or-file', async (event, filePath) => {
    return await deleteFolderOrFile(filePath);
  });
  //funcion para obtener listado de carpetas (mods)
  ipcMain.handle('get-mods', async () => {
    try {
      const basePath = await getBasePath();
      const modsPath = join(basePath, 'mods');
  
      const folders = fsExtra.readdirSync(modsPath).filter((file) => {
        return fsExtra.statSync(join(modsPath, file)).isDirectory();
      });
      return folders;
    } catch (error) {
      console.error('Error al leer directorios:', error);
      return [];
    }
  })
  //Funcion para extraer archivos .zip y moverlos a una ubicación
  ipcMain.handle('extract-and-move-zip', async (event, zipFilePath) => {
    try {
      const basePath = await getBasePath();
      const finalPath = join(basePath);
        
      await fsExtra.ensureDir(finalPath); // Crear carpeta final si no existe
  
      const zipStream = fsExtra.createReadStream(zipFilePath);
      const zip = zipStream.pipe(unzipper.Parse());
  
      zip.on('entry', async (entry) => {
        const entryPath = entry.path;
  
        // Construir la ruta de destino en la carpeta final
        const filePath = join(finalPath, entryPath);
  
        if (entry.type === 'File') {
          // Si la entrada es un archivo, asegúrate de que el directorio contenedor exista
          await fsExtra.ensureDir(join(finalPath, entryPath.substring(0, entryPath.lastIndexOf('/'))));
          entry.pipe(fsExtra.createWriteStream(filePath));
        } else if (entry.type === 'Directory') {
          // Si la entrada es un directorio, asegúrate de que el directorio exista
          await fsExtra.ensureDir(filePath);
        }
        event.sender.send('extract-progress', filePath);
      });
  
      await new Promise((resolve, reject) => {
        zip.on('close', resolve);
        zip.on('error', reject);
      });
  
      return true;
    } catch (error) {
      console.error('Error al descomprimir el archivo:', error);
      return false;
    }
  });
  //funcion para obtener la ruta base para el front-end
  ipcMain.handle('get-base-path', async () => {
    try {
      const config = JSON.parse(fsExtra.readFileSync(configPath, 'utf8'));
      return config.folderPath;
    } catch (error) {
      console.error('Error al leer el archivo de configuración:', error);
      return null;
    }
  });

  //manejador para crear folder de mods
  ipcMain.handle('create-mod-folder', async (event, folderName) => {
    try {
      const basePath = await getBasePath();
      const modsPath = join(basePath, 'mods');
      const newDir = join(modsPath, folderName, 'DDLC-1.1.1-pc');
  
      // Crear carpetas necesarias si no existen
      await fsExtra.ensureDir(newDir);
      await fsExtra.ensureDir(join(basePath, 'mods'));
      console.log(`Directorio creado o ya existe: ${newDir}`);
      return { success: true };
    } catch (error) {
      console.error('Error al crear el directorio:', error);
      return { success: false, error: error.message };
    }
  });

  //manejador para crear nuevo folder al cambiar ubicación
  ipcMain.handle('create-new-folder-rute', async (event, newRute) => {
    try {
      await fsExtra.ensureDir(join(newRute,'DDSC_Launcher'));
      await fsExtra.ensureDir(join(newRute,'DDSC_Launcher','DDLC-1.1.1-pc'))
      await fsExtra.ensureDir(join(newRute,'DDSC_Launcher', 'mods'));
      console.log(`Directorio cambiados`);
      return { success: true };
    } catch (error) {
      console.error('Error al crear el directorio:', error);
      return { success: false, error: error.message };
    }
  });

  // Manejador para seleccionar una carpeta
  ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })
    return result
  })

  ipcMain.handle('select-img', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'], // Cambiado de 'openDirectory' a 'openFile'
      filters: [
        { name: 'Archivos de imagen', extensions: ['png', 'jpg', 'jpeg', 'gif'] } // Asegúrate de incluir las extensiones correctas
      ]
    });
  
    return result;
  });

  // Manejador para seleccionar un archivo .zip
  ipcMain.handle('select-zip-file', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Archivos ZIP', extensions: ['zip'] }]
    });
  
    // Si el usuario selecciona un archivo, retornar la ruta
    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0]; // Retorna la ruta del archivo seleccionado
    } else {
      return null; // Si no se seleccionó ningún archivo o se canceló el diálogo
    }
  });

  //manejador para coíar archivos ddlc a carpeta de mods
  ipcMain.handle('copy-folder', async (event, { src, dest }) => {
    try {
      async function copyDirectory(srcDir, destDir) {
        const files = await fsExtra.readdir(srcDir);
        await fsExtra.ensureDir(destDir);
  
        for (let file of files) {
          const srcFile = join(srcDir, file);
          const destFile = join(destDir, file);
          const stats = await fsExtra.stat(srcFile);
  
          if (stats.isDirectory()) {
            await copyDirectory(srcFile, destFile);
          } else {
            await fsExtra.copy(srcFile, destFile);
          }
        }
      }
  
      await copyDirectory(src, dest);
      return { success: true };
    } catch (error) {
      console.error('Error al copiar la carpeta:', error);
      return { success: false, error: error.message };
    }
  });
  //Copiar archivos a carpeta del mod
  ipcMain.handle('copy-mod-folder', async (event, { src, dest }) => {
    try {
      // Depuración: Imprimir los valores de src y dest
      console.log(`Valor de src recibido: ${src}`);
      console.log(`Valor de dest recibido: ${dest}`);
  
      // Asegurarse de que sean strings
      if (typeof src !== 'string' || typeof dest !== 'string') {
        throw new Error('Los argumentos "src" y "dest" deben ser strings.');
      }
      const copiedFiles = [];
  
      async function copyDirectory(srcDir, destDir) {
        console.log(`Copiando desde: ${srcDir} hacia: ${destDir}`);
        const files = await fsExtra.readdir(srcDir);
        await fsExtra.ensureDir(destDir);
  
        for (let file of files) {
          const srcFile = join(srcDir, file);
          const destFile = join(destDir, file);
          const stats = await fsExtra.stat(srcFile);
  
          if (stats.isDirectory()) {
            await copyDirectory(srcFile, destFile);
          } else {
            await fsExtra.copy(srcFile, destFile, { overwrite: true });
            copiedFiles.push(destFile);
  
            // Emitir evento de progreso
            event.sender.send('copy-progress', {
              fileName: file,
              currentFile: copiedFiles.length,
              totalFiles: files.length
            });
          }
        }
      }
  
      await copyDirectory(src, dest);
      return { success: true, copiedFiles };
    } catch (error) {
      console.error('Error al copiar la carpeta:', error);
      return { success: false, error: error.message };
    }
  });
  
  //manejador para mostrar informacion del mod
  ipcMain.handle('get-ejecucion', async (event, selectedMod) => {
    try {
      const basePath = await getBasePath();
      const txtPath = join(basePath, 'mods', selectedMod, 'datos.txt');
      const data = fsExtra.readFileSync(txtPath, 'utf8');
      const match = data.match(/ejecucion=(\d+)/);
      if (match) {
        return parseInt(match[1], 10);
      }
      return null;
    } catch (error) {
      console.error('Error al leer el archivo:', error);
      return null;
    }
  });
  
  // Manejador para ejecutar mods
ipcMain.handle('run-mod', async (event, selectedMod) => {
  try {
    const basePath = await getBasePath();
    const modPath = join(basePath, 'mods', selectedMod, 'DDLC-1.1.1-pc');
    const txtFilePath = join(basePath, 'mods', selectedMod, 'datos.txt');

    let ejecucionCount = 1;
    if (fsExtra.existsSync(txtFilePath)) {
      const data = fsExtra.readFileSync(txtFilePath, 'utf8');
      const match = data.match(/ejecucion=(\d+),/);
      if (match) {
        ejecucionCount = parseInt(match[1], 10) + 1;
      }
    }
    fsExtra.writeFileSync(txtFilePath, `ejecucion=${ejecucionCount},`, 'utf8');

    const exeFiles = fsExtra.readdirSync(modPath).filter(file => file.endsWith('.exe'));
    const hasOtherExeFiles = exeFiles.length > 1;
    const ddlcExePath = join(modPath, 'DDLC.exe');

    let proceso;

    if (!hasOtherExeFiles && fsExtra.existsSync(ddlcExePath)) {
      await crearBatFile(join(basePath, 'mods', selectedMod), join(basePath, 'mods', selectedMod), "DDLC.exe");

      // Usar spawn para ejecutar el archivo y escuchar su finalización
      proceso = spawn(ddlcExePath);

    } else if (exeFiles.length > 0) {
      const otherExeFiles = exeFiles.filter(file => file !== 'DDLC.exe');
      const filteredFiles = otherExeFiles.filter(file => !file.includes('32'));

      if (filteredFiles.length > 0) {
        await crearBatFile(join(basePath, 'mods', selectedMod), join(basePath, 'mods', selectedMod), filteredFiles[0]);
        const selectedExePath = join(modPath, filteredFiles[0]);

        // Usar spawn para ejecutar el archivo alternativo y escuchar su finalización
        proceso = spawn(selectedExePath);

      } else {
        console.error('No se encontraron archivos .exe válidos para ejecutar.');
      }
    } else {
      console.error('No se encontraron archivos .exe en la carpeta.');
    }

    if (proceso) {
      // Escuchar cuando el proceso haya terminado
      proceso.on('close', (code) => {
        console.log(`Proceso terminado con el código: ${code}`);
        // Enviar un mensaje al frontend para notificar que el proceso ha finalizado
        event.sender.send('mod-execution-ended', { code });
      });
    }
  } catch (error) {
    console.error('Error al ejecutar el mod:', error);
  }
});

  //Abrir carpeta de persistentes
  ipcMain.handle('open-folder-persistent', async () => {
    try {
      const username = os.userInfo().username;
      const userPath = join('C:\\Users', username, 'AppData\\Roaming\\RenPy');
      console.log(`Abriendo explorador de archivos en: ${userPath}`);
      shell.openPath(userPath);
    } catch (error) {
      console.error('Error al abrir la carpeta persistente:', error);
    }
  });
  //eliminar archivo de config para cambiar ruta
  ipcMain.handle('delete-config-json', async () => {
    try {
      const username = os.userInfo().username;
      const userPath = join('C:\\Users', username, 'AppData\\Roaming\\ddsc_launcher\\config.json');
      await deleteFolderOrFile(userPath);
      console.log(`Eliminando archivo: ${userPath}`);
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  });
  //cambiar config.json o actualizar
  ipcMain.handle('new-file-config-change', async (event, { newRuteConfig })=>{
    console.log('Valor recibido de newRuteConfig: ', newRuteConfig);
    try{
      const ruta_final = String(newRuteConfig);
      const finalFolderPath = join(ruta_final, 'DDSC_Launcher');
      console.log('ruta a guardar: '+ finalFolderPath)
      // Guardar la ruta en el archivo de configuración
      const config = { folderPath: finalFolderPath };
      fsExtra.writeFileSync(configPath, JSON.stringify(config), 'utf8');
    }catch(err){
      console.error('Error al cambiar config:', err);
    }
  });
  //abrir carpeta raiz
  ipcMain.handle('open-folder-raiz', async () => {
    try {
      const basePath = await getBasePath();
      console.log(`Abriendo explorador de archivos en: ${basePath}`);
      shell.openPath(basePath);
    } catch (error) {
      console.error('Error al abrir la carpeta de mods:', error);
    }
  });
  //abrir carpeta de algun mod
  ipcMain.handle('open-folder-mod', async (event, ruta) => {
    try {
      const basePath = await getBasePath();
      const final = join(basePath,"mods", ruta, "DDLC-1.1.1-pc")
      console.log(`Abriendo explorador de archivos en: ${final}`);
      shell.openPath(final);
    } catch (error) {
      console.error('Error al abrir la carpeta del mod:', error);
    }
  });

  let currentRequest = null; // Variable global para almacenar el proceso de descarga actual
  let fileStream = null;
  let currentFilePath = '';  // Variable para almacenar la ruta del archivo descargado
  // Variable para asegurar que se cierre el stream
  let isStreamClosed = false;

  //descargar archivo
  ipcMain.on('download-file', async (event, fileUrl) => {
    try {
      const basePath = await getBasePath();
      const downloadPath = join(basePath, 'Downloads');
      const ident = Math.floor(Math.random() * (999 - 111 + 1) + 111);
      const name_zip = 'mod_' + String(ident) + ".zip";
      const filePath = join(downloadPath, name_zip);
      currentFilePath = filePath; // Guardar la ruta para eliminarla si se cancela la descarga
      if (!fsExtra.existsSync(downloadPath)) {
        fsExtra.mkdirSync(downloadPath, { recursive: true });
      }
  
      // Obtén la unidad donde se realizará la descarga
      const diskPath = basePath.split(':')[0] + ':\\'; // Por ejemplo, "C:\\"
      const diskInfo = await checkDiskSpace(diskPath);
  
      const request = net.request(fileUrl);
      currentRequest = request; // Guardamos la referencia de la solicitud actual
      let totalBytes = 0;
      let receivedBytes = 0;
  
      request.on('response', (response) => {
        if (response.statusCode === 200) {
          totalBytes = parseInt(response.headers['content-length'], 10);
  
          // Verificar si hay suficiente espacio antes de descargar
          if ((diskInfo.free) * 2 < totalBytes) {
            event.sender.send('download-error', 'No hay suficiente espacio en disco para descargar el archivo.');
            return;
          }
  
          fileStream = fsExtra.createWriteStream(filePath);
          isStreamClosed = false; // Reiniciar el estado del stream
          // Listener para asegurarse de que el stream se cierra
          fileStream.on('close', () => {
            isStreamClosed = true; // El stream se ha cerrado correctamente
          });
          response.pipe(fileStream);
  
          response.on('end', () => {
            fileStream.end(() => {
              fileStream.close();
              console.log('Archivo descargado completamente');
  
              // Verificar el tamaño del archivo antes de descomprimir
              const stats = fsExtra.statSync(filePath);
              if (stats.size !== totalBytes) {
                event.sender.send('download-error', 'El tamaño del archivo descargado no coincide con el tamaño esperado.');
                return;
              }
  
              // Emitir evento de descarga completa
              event.sender.send('download-complete');
  
              // Comenzar a descomprimir el archivo
              const extractPath = join(downloadPath, 'extracted');
              fsExtra.createReadStream(filePath)
                .pipe(unzipper.Extract({ path: extractPath }))
                .on('close', () => {
                  event.sender.send('extraction-complete');
                  event.sender.send('unzip-complete');
                })
                .on('error', (err) => {
                  console.error('Error al descomprimir:', err);
                  event.sender.send('unzip-error', 'Error al descomprimir el archivo.');
                });
            });
          });
        } else {
          console.error(`Failed to download file. Status code: ${response.statusCode}`);
          event.sender.send('download-error', `Error: Código de estado ${response.statusCode}`);
        }
      });
  
      request.on('error', (error) => {
        console.error(`Error during file download: ${error.message}`);
        event.sender.send('download-error', `Error durante la descarga: ${error.message}`);
      });
  
      request.end();
    } catch (error) {
      console.error('Error :', error);
      event.sender.send('download-error', `Error general: ${error.message}`);
    }
  });
  // Al cancelar la descarga
ipcMain.on('cancel-download', async (event) => {
  if (currentRequest) {
    currentRequest.abort(); // Cancelar la solicitud de descarga
  }

  if (fileStream) {
    fileStream.close(); // Intentar cerrar el stream si está abierto
  }

  // Intentamos eliminar después de asegurarnos de que el stream se cerró
  const interval = setInterval(async () => {
    if (isStreamClosed) { // Solo cuando el stream esté cerrado
      clearInterval(interval); // Detener el intervalo

      if (currentFilePath) {
        console.log('Eliminando archivo:', currentFilePath);
        const deleteResult = await deleteFolderOrFile(currentFilePath);
        if (deleteResult.success) {
          event.sender.send('download-cancelled', deleteResult.message);
        } else {
          console.error(`Error al eliminar archivo: ${deleteResult.message}`);
        }
        
      }
    }
  }, 100); // Verificar cada 100 ms si el stream está cerrado
});
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

