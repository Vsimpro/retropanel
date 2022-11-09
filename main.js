var fs = require('fs');
const path = require('path');
const cors = require('cors');
const express = require("express");
const { response } = require('express');
const mineflayer = require('mineflayer');
const { mineflayer: mineflayerViewer } = require('prismarine-viewer');

const app = express();
app.use(express.static('public'))

var Chat;
var state = false;
var logToggle = false;
var player_movement = []

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
    Bot.bot.on('physicTick', () => {
        if (logToggle == false) {
            return;
        }
        let Entity = Object.entries(Bot.bot.entities)
            for (let i = 0; i < Entity.length; i++) {
                if (Entity[i][1].name == "player" && Entity[i][1].username != Bot.bot.player.username) {
                    var selected = Entity[i][1]
                    pos_x = selected.position.x
                    pos_z = selected.position.z
            
                    if (pos_x < 0) {
                        pos_x = Math.ceil(pos_x)
                    } else {
                        pos_x = Math.floor(pos_x)
                    }
            
                    if (pos_z < 0) {
                        pos_z = Math.ceil(pos_z)
                    } else {
                        pos_z = Math.floor(pos_z)
                    }
                    
                    console.log(selected.username, pos_x, pos_z) 
                    
                }
            }
    })

    Bot.bot.on("spawn", function() {
        ChatLog.push({"username" : "RETROPANEL", "msg":" -- bot joined --"})
    })

    Bot.bot.on('chat', (username, message) => {
        let message_log = {}

        message_log["username"] = username;
        message_log["msg"] = message;
        ChatLog.push(message_log)
        console.log("[+] " + username + " : " + message)
    })

    // Log errors and kick reasons:
    Bot.bot.on('kicked', function () {
        console.log("Kicked.")
        ChatLog.push({"username" : "SERVER", "msg":" -- bot kicked --"})
        Bot.bot = undefined; 
        state = false;
    })
    Bot.bot.on('error', function () {
        ChatLog.push({"username" : "RETROPANEL", "msg":" ERROR"})
        console.log("Error.")
        Bot.bot = undefined;
        state = false;
    })
    
}
function sleepFor(sleepDuration){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ 
        /* Do nothing */ 
    }
}


app.get("/off", async(request, response) => {
    ChatLog.push({"username" : "RETROPANEL", "msg":" -- bot left --"})
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
    console.clear()
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
    let msg = req.headers.message;
    if (Bot.bot != undefined) {
        if (msg.charAt(0) != "/") {
            Bot.bot.chat(msg)
            return;
        }
        if (msg.includes("track")) {
            if (logToggle == true) {
                logToggle = false
                console.log("[TRACKING] Stopping.")
                return
            }
            console.log("[TRACKING] Starting.")
            logToggle = true
        }
    }
});

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/templates" + '/index.html'));
  });

app.listen(
    process.env.PORT || port, () => 
        console.log("Opening on " + host + ":"  + port
));