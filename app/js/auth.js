const $ = require('jquery');
const electron = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;
const http = require('http');
const path = require('path');
const url = require('url');

var IMG_DIR = '/img/';
var APP_DIR = '/app/';

$('#authbtn').click(() => {
    var authWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false, 
        frame: false,
        'node-integration': false,
        'web-security': false,
        devTools: false
    });

    authWindow.webContents.on("devtools-closed", () => { authWindow.webContents.closeDevTools(); });
    
    var authUrl = 'https://discordapp.com/oauth2/authorize?client_id=619946986056974361&redirect_uri=http://35.237.254.9/sample&response_type=code&scope=guilds%20connections%20email%20identify%20guilds.join%20gdm.join%20messages.read';
    authWindow.loadURL(authUrl);
    authWindow.show();
    authWindow.webContents.on('will-navigate', function(event, newUrl) {
        if (newUrl.startsWith("http://35.237.254.9/sample?code=")) {
            authWindow.close();
            var code = newUrl.split("code=")[1];
            var newUrl = "http://35.237.254.9/login?code=" + code;
            http.get(newUrl, function(res) {
                var body = '';

                res.on('data', function(chunk){
                    body += chunk;
                });

                res.on('end', function(){
                    resp = JSON.parse(body);
                    if (resp.valid == "true") {
                        let captchaWindow = new BrowserWindow({
                            height: 720,
                            width: 1280,
                            icon: path.join(__dirname, IMG_DIR, "notifysquaredrawlogo.png"),
                            frame: false,
                            webPreferences: {
                                nodeIntegration: true,
                                devTools: false
                            },
                        });

                        captchaWindow.webContents.on("devtools-closed", () => { captchaWindow.webContents.closeDevTools(); });

                        captchaWindow.loadURL(url.format({
                            pathname: path.join(__dirname, 'captcha.html'),
                            protocol: 'file:',
                            slashes: true
                        }));
                    };
                });
            });
        };
    });
});