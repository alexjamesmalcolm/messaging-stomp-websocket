let stompClient = null;

const all = true;

function $(selector, all) {
    if (all) {
        return document.querySelectorAll(selector);
    }
    return document.querySelector(selector);
}

function setConnected(connected) {
    const connect = $("#connect");
    const disconnect = $("#disconnect");
    const conversation = $("#conversation");
    if(connected) {
        connect.setAttribute("disabled", "true");
        disconnect.removeAttribute("disabled");
        conversation.classList.remove("hide");
    } else {
        connect.removeAttribute("disabled");
        disconnect.setAttribute("disabled", "true");
        conversation.classList.add("hide");
    }
    $("#greetings").innerHTML = "";
}

function connect() {
    const socket = new SockJS("/gs-guide-websocket");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, frame => {
        setConnected(true);
        console.log(`Connected: ${frame}`);
        stompClient.subscribe("/topic/greetings", greeting => showGreeting(JSON.parse(greeting.body).content));
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    stompClient.send("/app/hello", {}, JSON.stringify({
        "name": $("#name").value
    }));
}

function showGreeting(message) {
    document.querySelector("#greetings").innerHTML += `<tr><td>${message}</td></tr>`;
}

$("form", all).forEach(form => {
    form.addEventListener("submit", e => e.preventDefault());
});

$("#connect").addEventListener("click", e => connect());
$("#disconnect").addEventListener("click", e => disconnect());
$("#send").addEventListener("click", e => sendName());