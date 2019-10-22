const $ = require('jquery');
const fs = require('fs')
const puppeteer = require('puppeteer');
const stream = require('stream');
const readline = require('readline');
var locateChrome = require('locate-chrome');

function uuidGenerator() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function randomLetters(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function createTask(email, password, proxy, id, statusId) {
    var button = document.getElementById(id);
    if (button.style.opacity = "1") {
        button.style.opacity = "0.5";
        button.innerHTML = "STOP";
        var status = document.getElementById(statusId);
        let browser;
        status.innerHTML = "Loading";
        locateChrome(async function(l) {
        });

        locateChrome().then(async function(l) {
            if (proxy != "N / A") {
                browser = await puppeteer.launch({ headless: false, executablePath: l, args: ["--disable-notifications", "--mute-audio", "--proxy-server="+proxy] });
            } else {
                browser = await puppeteer.launch({ headless: false, executablePath: l, args: ["--disable-notifications", "--mute-audio"] });
            };
            browser.on('disconnected', function () {
                button.style.opacity = "1.0";
                button.innerHTML = "START";
                status.innerHTML = "Idle";
            });
            const page = await browser.newPage();
            page.on('dialog', async dialog => {
                await dialog.dismiss();
            });
    
            console.log("test");
            await page.goto('https://accounts.google.com/signin/v2/identifier?service=mail&passive=true&rm=false&continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin');
            console.log("ez");
            await page.waitFor(2000);
            console.log("veryez");
            await page.keyboard.type(email);
            await page.keyboard.press('Enter');
            await page.waitFor(5000);
            await page.click('input[type="password"]');
            await page.keyboard.type(password);
            await page.keyboard.press('Enter');
            await page.waitFor(30000);
    
            var successino = 0;
            var waittil = getRandomInt(10);
            while (waittil != successino) {
                var list = [
                    "Youtube",
                    "Documents"
                ];
                var firstRandomItem = list[Math.floor(Math.random()*list.length)];
                if (firstRandomItem == "Youtube") {
                    list.shift();
                    status.innerHTML = "Watching Youtube";
                    var videoAmt = getRandomInt(6);
                    await page.goto("https://www.youtube.com");
                    for (i = 0; i < videoAmt; i++) {
                        await page.waitForSelector('input[id="search"]');
                        // https://9spf2q47qc.execute-api.us-east-1.amazonaws.com/Beta
                        var request = new XMLHttpRequest();
                        request.open("GET", "https://9spf2q47qc.execute-api.us-east-1.amazonaws.com/Beta", false);
                        request.send(null);
                        var resp = request.responseText;
                        var resp = resp.replace('"', '');
                        await page.evaluate(() => document.getElementById("search").value = "");
                        await page.keyboard.type(resp);
                        await page.click("#search");
                        await page.keyboard.press('Enter');
                        await page.waitForNavigation();
                        // await page.waitForSelector('a[id="video-title"]');
                        await page.click('a[id="video-title"]');
                        await page.waitFor(getRandomInt(600000));
                    }
                } else if (firstRandomItem == "Documents") {
                    list.pop();
                    status.innerHTML = "Writing on Docs";
                    await page.goto('https://docs.google.com/document/u/0/create?usp=docs_home&ths=true');
                    await page.waitForSelector('input[class="docs-title-input"]');
                    await page.click('input[class="docs-title-input"]');
                    await page.keyboard.type(randomLetters(8));
                    await page.keyboard.press('Enter');
                    var random_interval = getRandomInt(175);
                    for(i = 0; i < random_interval; i++) {
                        var randomWord = getRandomInt(8);
                        await page.keyboard.type(`${randomLetters(randomWord)} `);
                        await page.waitFor(getRandomInt(4000));
                    };
                };
                successino++;
            };
        });
    };
};

$('#addtaskbtn').click(() => {
    var input_email = document.getElementById('input_email');
    var input_password = document.getElementById('input_password');
    var input_proxy = document.getElementById('input_proxy');

    var email = input_email.value;
    var password = input_password.value;
    
    let proxy;
    if (input_proxy.value == "Proxy") {
        proxy = "N / A";
    } else {
        proxy = input_proxy.value;
    }

    console.log(password);

    var path = 'accounts.txt';
    buffer = new Buffer(`{"email": "${email}", "password": "${password}", "proxy": "${proxy}"}\n`);
    try {
        fs.open(path, 'a', function(err, fd) {
            if (err) {
                alert('error opening file: ' + err);
            }
    
            fs.write(fd, buffer, 0, buffer.length, null, function(err) {
                if (err) alert('error writing file: ' + err);
                fs.close(fd, function() {
                })
            });
        });
    } catch (err) {
        fs.open(path, 'w', function(err, fd) {
            if (err) {
                alert('error opening file: ' + err);
            }
    
            fs.write(fd, buffer, 0, buffer.length, null, function(err) {
                if (err) alert('error writing file: ' + err);
                fs.close(fd, function() {
                })
            });
        });
    }

    var table = document.getElementById("boxtable");
    var lastNum = table.rows.length;
    var row = table.insertRow(lastNum);
    row.className = "rows";
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);

    cell1.innerHTML = "<span id='email'>" + email + "</span>";
    cell2.style.display = "none";
    cell2.innerHTML = password;
    let newProxy;
    if (proxy == "127.0.0.1" || proxy == "" || proxy == "Proxy") {
        cell3.innerHTML = "N / A";
        newProxy = "N / A";
    } else {
        newProxy = proxy.split(":");
        try {
            cell3.innerHTML = newProxy[0].toString() + ":" + newProxy[1].toString();
        } catch (error) {
            cell3.innerHTML = newProxy[0].toString();
        }
    };

    var status_ele = document.createElement("span");
    status_ele.type = "span";
    status_ele.innerHTML = "Waiting..."
    status_ele.id = uuidGenerator();
    cell4.appendChild(status_ele);

    var ele = document.createElement("img");
    ele.className = "cmdStart";
    ele.src = "img/start.png";
    ele.id = uuidGenerator();
    ele.onclick = function () {
        var id = ele.id;
        var statusId = status_ele.id;
        createTask(email, password, newProxy, id, statusId);
    };
    cell5.appendChild(ele);

    var textnode = document.createTextNode(" ");
    cell5.appendChild(textnode);

    var delele = document.createElement("img");
    delele.className = "cmdDelete";
    delele.src = "img/trash.png";
    delele.id = uuidGenerator();
    delele.onclick = function () {
        var $row = $(this).closest("tr");
        var delemail = $row.find("#email").text();
        var delpassword = $row.find("#password").text();
        var delproxy = $row.find("#proxy").text();
        var delinstream = fs.createReadStream('./accounts.txt');
        var deloutstream = new stream;
        var delrl = readline.createInterface(delinstream, deloutstream);

        var dellines = [];

        delrl.on('line', function(line) {
            // process line here
            dellines.push(line);
        });
        
        delrl.on('close', function() {
            fs.readFile('accounts.txt', {encoding: 'utf-8'}, function(err, data) {
                if (err) throw error;
            
                let dataArray = data.split('\n'); // convert file data in an array
                let lastIndex = -1; // let say, we have not found the keyword
            
                for (let index=0; index<dataArray.length; index++) {
                    if (dataArray[index].includes(delemail) && dataArray[index].includes(delpassword) && dataArray[index].includes(delproxy)) { // check if a line contains the 'user1' keyword
                        lastIndex = index; // found a line includes a 'user1' keyword
                        break; 
                    }
                }
            
                dataArray.splice(lastIndex, 1); // remove the keyword 'user1' from the data Array
            
                // UPDATE FILE WITH NEW DATA
                // IN CASE YOU WANT TO UPDATE THE CONTENT IN YOUR FILE
                // THIS WILL REMOVE THE LINE CONTAINS 'user1' IN YOUR shuffle.txt FILE
                const updatedData = dataArray.join('\n');
                fs.writeFile('accounts.txt', updatedData, (err) => {
                    if (err) throw err;
                });
            
            });
        });

        table.deleteRow($row.index());
    };
    cell5.appendChild(delele);
});



$('#email').click(() => {
    var email = document.getElementById("email").value;
    if (email == "Email") {
        document.getElementById("email").value = "";
    };
})

$('#password').click(() => {
    var password = document.getElementById("password").value;
    if (password == "Password") {
        document.getElementById("password").value = "";
    };
})

$('#proxy').click(() => {
    var proxy = document.getElementById("proxy").value;
    if (proxy == "Proxy") {
        document.getElementById("proxy").value = "";
    };
})

let instream;
let outstream;
let rl;

try {
    instream = fs.createReadStream('./accounts.txt');
    outstream = new stream;
    rl = readline.createInterface(instream, outstream);
} catch (err) {
    fs.open(path, 'w', function(err, fd) {
    });
}
var lines = [];

rl.on('line', function(line) {
  // process line here
  lines.push(line);
});

function create(line) {
    var info = JSON.parse(line);
    var email = info.email;
    var password = info.password;
    var proxy = info.proxy;

    buffer = new Buffer(`{"email": "${email}", "password": "${password}", "proxy": "${proxy}"}\n`);

    var table = document.getElementById("boxtable");
    var lastNum = table.rows.length;
    var row = table.insertRow(lastNum);
    row.className = "rows";
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);

    cell1.innerHTML = "<span id='email'>" + email + "</span>";
    cell2.style.display = "none";
    cell2.innerHTML = password;
    let newProxy;
    if (proxy == "127.0.0.1" || proxy == "" || proxy == "Proxy") {
        cell3.innerHTML = "N / A";
        newProxy = "N / A";
    } else {
        newProxy = proxy.split(":");
        try {
            cell3.innerHTML = newProxy[0].toString() + ":" + newProxy[1].toString();
        } catch (error) {
            cell3.innerHTML = newProxy[0].toString();
        }
    };

    var status_ele = document.createElement("span");
    status_ele.type = "span";
    status_ele.innerHTML = "Waiting..."
    status_ele.id = uuidGenerator();
    status_ele.className = "status";
    cell4.appendChild(status_ele);

    var ele = document.createElement("img");
    ele.className = "cmdStart";
    ele.src = "img/start.png";
    ele.id = uuidGenerator();
    ele.onclick = function () {
        var id = ele.id;
        var statusId = status_ele.id;
        createTask(email, password, newProxy, id, statusId);
    };
    cell5.appendChild(ele);

    var textnode = document.createTextNode(" ");
    cell5.appendChild(textnode);

    var delele = document.createElement("img");
    delele.className = "cmdDelete";
    delele.src = "img/trash.png";
    delele.id = uuidGenerator();
    delele.onclick = function () {
        var $row = $(this).closest("tr");
        var delemail = $row.find("#email").text();
        var delpassword = $row.find("#password").text();
        var delproxy = $row.find("#proxy").text();
        var delinstream = fs.createReadStream('./accounts.txt');
        var deloutstream = new stream;
        var delrl = readline.createInterface(delinstream, deloutstream);

        var dellines = [];

        delrl.on('line', function(line) {
            // process line here
            dellines.push(line);
        });
        
        delrl.on('close', function() {
            fs.readFile('accounts.txt', {encoding: 'utf-8'}, function(err, data) {
                if (err) throw error;
            
                let dataArray = data.split('\n'); // convert file data in an array
                let lastIndex = -1; // let say, we have not found the keyword
            
                for (let index=0; index<dataArray.length; index++) {
                    if (dataArray[index].includes(delemail) && dataArray[index].includes(delpassword) && dataArray[index].includes(delproxy)) { // check if a line contains the 'user1' keyword
                        lastIndex = index; // found a line includes a 'user1' keyword
                        break; 
                    }
                }
            
                dataArray.splice(lastIndex, 1); // remove the keyword 'user1' from the data Array
            
                // UPDATE FILE WITH NEW DATA
                // IN CASE YOU WANT TO UPDATE THE CONTENT IN YOUR FILE
                // THIS WILL REMOVE THE LINE CONTAINS 'user1' IN YOUR shuffle.txt FILE
                const updatedData = dataArray.join('\n');
                fs.writeFile('accounts.txt', updatedData, (err) => {
                    if (err) throw err;
                });
            
            });
        });

        table.deleteRow($row.index());
    };
    cell5.appendChild(delele);
};

rl.on('close', function() {
    var i;
    for (i = 0; i < lines.length; i++) {
        create(lines[i]);
    };    
});
