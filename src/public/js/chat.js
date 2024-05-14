
const socket = io();
let user;


const chatBox = document.getElementById("chatBox");


Swal.fire({
    title: "Identifícate",
    input: "text",
    text: "Ingresa un usuario para identificarte en el chat",
    inputValidator: (value) => {
        return !value && "Necesitas escribir un nombre para continuar";
    },
    allowOutsideClick: false,
}).then(result => {
    user = result.value;
})

// Envío de mensajes
chatBox.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        if (chatBox.value.trim().length > 0) {
            socket.emit("message", { user: user, message: chatBox.value });
            chatBox.value = "";
        }
    }
})

// Listener de mensajes
socket.on("messagesLogs", data => {
    const log = document.getElementById("messagesLogs");
    let messages = "";

    data.forEach((message) => {
        messages = messages + `${message.user}: ${message.message} <br>`;
    })
    log.innerHTML = messages;
})
