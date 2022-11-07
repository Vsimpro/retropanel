var fs = require('fs');
const path = require('path');
const cors = require('cors');
const express = require("express");
const { response } = require('express');
const mineflayer = require('mineflayer');
const { mineflayer: mineflayerViewer } = require('prismarine-viewer');

const app = express();
app.use(express.static('public'))

var state = false;
var Chat;

var ChatLog = [

]

const port = 5501;
const host = "http://0.0.0.0"

var credentials = {
    "username"    : "",
    "password "   : "",
    "auth "       : "microsoft"
}

var server = {
    "host"    : "",
    "port"    : "25565",
    "version" : "1.19"
}

let content = fs.readFileSync(process.cwd() + "/" + "config.json").toString()

server = JSON.parse(content).config.server
credentials = JSON.parse(content).config.credentials

class Bot {
    constructor() {
        var bot;
    }
}
function join() {
    Bot.bot = mineflayer.createBot({
        
        host:       server["host"], // minecraft server ip
        username:   credentials["username"], // minecraft username
        password:   credentials["password"], // minecraft password, comment out if you want to log into online-mode=false servers            port:       Bot.server.port,                // only set if you need a port that isn't 25565
        //version:    server.version,             // only set if you need a specific version or snapshot (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
        auth:       credentials["auth"]              // only set if you need microsoft auth, then set Bot to 'microsoft'
    })

    // Log errors and kick reasons:
    Bot.bot.on('kicked', function () {
        console.log("Kicked.")
        Bot.bot = undefined; 
        state = false;
    })
    Bot.bot.on('error', function () {
        console.log("Error.")
        Bot.bot = undefined;
        state = false;
    })
    
}

function chatMessages(bot) {
    if (Bot.bot == undefined) { return }
    
    bot.on('chat', (username, message) => {
        let message_log = {}

    message_log["username"] = username;
    message_log["msg"] = message;
    
    ChatLog.push(message_log)

    console.log("[+] " + username + " : " + message)
    })
}


app.get("/off", async(request, response) => {
    state = false
    if (Bot.bot != undefined) {
        Bot.bot.end();
        console.log("[BOT] off.")
        response.send({"bot_status":"offline"});
        return
    } else {
        console.log("[BOT] Error disconnecting")
    }
    response.send({"bot_status":"error"});
});

app.get("/on", async(request, response) => {
    state = true;
    let message = {"bot_status":"error"}

    join()
    
    if (Bot.bot != undefined) {
        message = {"bot_status":"online"};
        console.log("[BOT] on")
    } 
    setTimeout(function(){ chatMessages(Bot.bot) }, 0);
    response.send(message);
}); 

app.get("/chat", async (request, response) => {
    response.send(ChatLog);
});


app.get("/status", async (request, response) => {
    response.send({"status":state});
});

app.use(express.static(__dirname + "/templates/"));
app.use(cors({
    origin: 'http://127.0.0.1:5500'
}));

app.post("/send", function(req, res) {
    if (Bot.bot != undefined) {
        Bot.bot.chat(req.headers.message)    
    }
});

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/templates" + '/index.html'));
  });

app.listen(
    process.env.PORT || port, () => 
        console.log("Opening on " + host + ":"  + port
));