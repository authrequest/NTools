// const $ = require('jquery');
const remote = require('electron').remote;

var win = remote.getCurrentWindow();

$('#close').click(() => {
    win.close();
});

$('#minimize').click(() => {
    win.minimize();
})