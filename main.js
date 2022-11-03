const path = require('path');
const cors = require('cors');
const express = require("express");
const { response } = require('express');
const mineflayer = require('mineflayer');

const app = express();
app.use(express.static('public'))

var state = false;

const port = 5501;
const host = "http://0.0.0.0"

const credentials = {
    username    : "",
    password    : "",
    auth        : "microsoft"
}

const server = {
    host    : "",
    port    : "25565",
    version : "1.19"
}

class Bot {
    constructor() {
        var bot;
    }
}
function join() {
    Bot.bot = mineflayer.createBot({
        
        host:       server.host, // minecraft server ip
        username:   credentials.username, // minecraft username
        password:   credentials.password, // minecraft password, comment out if you want to log into online-mode=false servers            port:       Bot.server.port,                // only set if you need a port that isn't 25565
        version:    server.version,             // only set if you need a specific version or snapshot (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
        auth:       credentials.auth              // only set if you need microsoft auth, then set Bot to 'microsoft'
    })

    // Log errors and kick reasons:
    Bot.bot.on('kicked', console.log)
    Bot.bot.on('error', console.log)
}
    


function chatMessages(bot) {
    bot.on('chat', (username, message) => {
    if (username === bot.username) return
    //bot.chat(message)
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
    
    join()
    chatMessages(Bot.bot)
    
    if (Bot.bot != undefined) {
        response.send({"bot_status":"online"});
        console.log("[BOT] on")
        return
    } 

    response.send({"bot_status":"error"});
}); 

app.get("/status", async (request, response) => {
    response.send({"status":state});
});

app.use(express.static(__dirname + "/templates/"));
app.use(cors({
    origin: 'http://127.0.0.1:5500'
}));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/templates" + '/index.html'));
  });

app.listen(
    process.env.PORT || port, () => 
        console.log("Opening on " + host + ":"  + port
));