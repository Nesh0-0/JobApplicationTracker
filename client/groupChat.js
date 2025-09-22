const socket = io("http://localhost:3000");

// Get group info from URL
const urlParams = new URLSearchParams(window.location.search);
const groupId = urlParams.get("groupId");
const groupName = urlParams.get("groupName");

// Set title
document.getElementById("groupTitle").textContent = `Chat - ${groupName}`;

// Join group room
socket.emit("joinGroup", { groupId });

// Load previous messages from backend (REST API)
const loadMessages = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`http://localhost:3000/messages/getMessages/${groupId}`, {
      headers: { Authorization: token },
    });

    if (!res.data.success)
        throw new Error(res.data.message);
    
    console.log(res.data.details);
    const chatBox = document.getElementById("chatBox");
    chatBox.innerHTML = "";
    res.data.details.forEach((msg) => {
      appendMessage(msg.username, msg.message);
    });
  } catch (err) {
    console.log("Error loading messages:", err);
  }
};
loadMessages();

// Send new message
document.getElementById("chatForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = document.getElementById("messageInput");
    const message = input.value.trim();

    if (message) {
        const token = localStorage.getItem("token");
        socket.emit("sendMessage", { groupId, text: message, token });
        try {

            const response = await axios.post('http://localhost:3000/messages/addMessage/', { groupId, message }, { headers: { Authorization: token } });
            if (!response.data.success) {

                alert('Could not send message!');
                throw new Error(response.data.message);
            }
            
            input.value = "";
        }
        catch (err) {
            console.log(err);
        }
    }

});

// Listen for messages in this group
socket.on("message", (msg) => {
    appendMessage(msg.userName, msg.text);
});

// Helper function to add messages to chat box
function appendMessage(user, text) {
    const chatBox = document.getElementById("chatBox");
    const div = document.createElement("div");
    div.classList.add("mb-2");
    div.innerHTML = `<strong>${user}:</strong> ${text}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight; // auto-scroll
}


// Leave group button
const leaveGroupBtn = document.getElementById("leaveGroupBtn");
leaveGroupBtn.addEventListener("click", () => {
    if (socket) {
        socket.disconnect(); // close socket connection
        console.log("Socket disconnected");
    }
    window.location.href = "discussionPortal.html"; // redirect to groups page
});
