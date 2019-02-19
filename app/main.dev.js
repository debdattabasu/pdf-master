/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, ipcMain, screen} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import * as pdfmake from 'pdfmake'

const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path')

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('scrapePDF', (event, path) => {
  const dataBuffer = fs.readFileSync(path);
  pdf(dataBuffer)
    .then((data) => event.returnValue = data)
    .catch((error) => {
      console.error('Error parsing pdf:', error)
      event.returnValue = []
    });
});

// ipcMain.on('scrapePDF', (event, path) => {
//   var extract = require('pdf-text-extract')
//   var options = {
//     layout: 'htmlmeta'
//   }
//   extract(path, options, function (err, pages) {
//     if (err) {
//       console.dir(err)
//       return
//     }
//     event.returnValue = {text: pages[0].toString()}
//     console.log('extracted pages', pages[0])
//   })
// });


//DOCS: https://pdfmake.github.io/docs/
ipcMain.on('generateTaskPDF', (event, path, content) => {
  const join = require('path') //path is overriten for some reason
  const normal = join.join(__dirname, '/fonts/Roboto-Regular.ttf');
  const bold = join.join(__dirname, '/fonts/Roboto-Medium.ttf');
  const italic = join.join(__dirname, '/fonts/Roboto-Italic.ttf');
  const boldItalics = join.join(__dirname, '/fonts/Roboto-Italic.ttf');
  const fonts = {
    Roboto: {
      normal,
      bold,
      italic,
      boldItalics,
    }
  };
  const options = {
    pageMargins: [ 10, 10, 10, 10 ],
    pageOrientation: 'landscape',
    pageSize: 'A4',
  };
  const printer = new pdfmake.default(fonts);
  const pdfDoc = printer.createPdfKitDocument(content, options);
  pdfDoc.pipe(fs.createWriteStream(`${path}.pdf`));
  pdfDoc.end();
  event.returnValue = 'DONE'
});

ipcMain.on('generateTaskPDF2', (event, path) => {
  const option = {
    landscape:  true,
    marginsType: 0,
    printBackground: false,
    printSelectionOnly: false,
    pageSize: "A4",
  };
  mainWindow.webContents.printToPDF(option, function(err, data) {
    if (err) {
      console.error(err)
      return;
    }
    try{
      if(path) {
        fs.writeFileSync(`${path}.pdf`, data);
        return event.returnValue = 'DONE'
      }
    }catch(err){
      console.error(err)
    }
  });
  return event.returnValue = 'DONE'
});

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const icon = path.join(__dirname, 'app.icns');
  mainWindow = new BrowserWindow({ width, height, icon});
  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
});
