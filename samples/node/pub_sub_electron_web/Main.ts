const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    // webPreferences: {
    //   preload: path.join(__dirname, './preload.js')
    // }
  })
  win.webContents.openDevTools();
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})