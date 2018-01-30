const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

var rls = require('rls-api');

var client = new rls.Client({
    token: "QDQOV7OV1J0OOKKSPUU7SZDJHXLRPCLB"
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})
  
  win.setMenuBarVisibility(false);

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))


  client.getPlayer("76561198043101035", rls.platforms.STEAM, function(status, data){
    if(status === 200){
        console.log("-- Player Data:");
        console.log("   Display name: " + data.displayName);
        console.log("   Goals: " + data.stats.goals);
        console.log("   Profile URL: " + data.profileUrl);
        console.log("   Avatar: " + data.avatar);

        
        win.webContents.executeJavaScript(
            `document.getElementById("avatar").src += '${data.avatar}'`
            
        )

        win.webContents.executeJavaScript(
            `document.getElementById("displayName").innerHTML += '${data.displayName}'`
        )

        win.webContents.executeJavaScript(
            `document.getElementById("platform").innerHTML += '${data.platform.name}'`
        )

        win.webContents.executeJavaScript(
            `document.getElementById("goals").innerHTML += '${data.stats.goals}'`
        )

        win.webContents.executeJavaScript(
            `document.getElementById("wins").innerHTML += '${data.stats.wins}'`
        )

        win.webContents.executeJavaScript(
            `document.getElementById("mvps").innerHTML += '${data.stats.mvps}'`
        )
      
    } else {
        console.log("-- getPlayer failed: " + status);
    }
});

  // Open the DevTools.
  //win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.