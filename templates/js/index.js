console.log("** INIT **")

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
    let state = "black"
    let status = "unknown" 
    let icon = "img/computer_2-4.png"

    const response = await fetch("http://localhost:5501/status");
    var data = await response.json();

    if (data["status"] == true) {
        console.log("Bot is online")

        status = "online"
        state = "lightgreen";
        icon = "img/network_drive_cool-3.png"

    } else {
        console.log("Bot is offline")

        icon = "img/network_drive_unavailable-3.png"
        state = "red";
        status = "offline"
    }
    
    document.getElementById("status_icon").src = icon
    document.getElementById("bot_status").innerHTML = status;
    document.getElementById("bot_status").style.color = state;
    document.getElementById("bot_status_dec").innerHTML = `Bot currently ${status}`
}

async function getDataFrom(url){
    const response = await fetch(url);
    var data = await response.json();

    return data;
}

set_status()