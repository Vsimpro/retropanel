console.log("** INIT **")

var chat = []

function sleepFor(sleepDuration){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ 
        /* Do nothing */ 
    }
}


function bot_control(url) {
    data = getDataFrom(url);  
    set_status()
}

function start_bot() {
    bot_control("http://localhost:5501/on");
}

function stop_bot() {
    bot_control("http://localhost:5501/off"); 
}

async function set_status() {
    while (true) {
        sleepFor(400);
        let state = "black"
        let status = "unknown" 
        let icon = "img/computer_2-4.png"

        const response = await fetch("http://localhost:5501/status");
        var data = await response.json();

        if (data["status"] == true) {
            

            status = "online"
            state = "lightgreen";
            icon = "img/network_drive_cool-3.png"

        } else {
           

            icon = "img/network_drive_unavailable-3.png"
            state = "red";
            status = "offline"
        }
        
        refreshChat()

        document.getElementById("status_icon").src = icon
        document.getElementById("bot_status").innerHTML = status;
        document.getElementById("bot_status").style.color = state;
        document.getElementById("bot_status_dec").innerHTML = `Bot currently ${status}`
    }
}

function create_chat(username,message) {
    if (message.length >= 64) {
        message = message.slice(0, 42)
        message += "..."
    }
    
    let listItem = document.createElement("li");
    let line = document.createTextNode(`${username}
    : ${message}`);

    listItem.className += "chat_msg"
    listItem.appendChild(line)
    document.getElementById("chat").appendChild(listItem)
}

function getDataFrom(url){
    const response = fetch(url);
    var data = response;

    return data;
}

function refreshChat() {
    url = "http://localhost:5501/chat"

    let req = new XMLHttpRequest();
    req.open("GET", url)
    req.send();
    req.onload = () => {
        let list = JSON.parse(req.response)
        
        let prev = chat
        chat = list

        if (list == prev){
            return
        }

        document.getElementById("chat").innerHTML = "";
        
        let start = 0

        if (list.length >= 10) {
            start = list.length - 10
        }
        
        for (let i = start; i < list.length; i++) {
            create_chat(list[i]["username"],list[i]["msg"])
        }
    }
}


setTimeout(function(){ set_status() }, 0);
refreshChat()

