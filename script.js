// Store users data
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Check if user is logged in
if (currentUser) {
    showScreen("chatScreen");
    document.getElementById("currentUsername").textContent =
        currentUser.username;
}

// Screen management
function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach((screen) => {
        screen.classList.add("hidden");
    });
    document.getElementById(screenId).classList.remove("hidden");
}

// Handle Sign Up
document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("signupUsername").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    // Check if user already exists
    if (users.find((user) => user.email === email)) {
        alert("User already exists!");
        return;
    }

    // Add new user
    users.push({ username, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    // Clear form
    e.target.reset();

    // Show login screen
    showScreen("loginScreen");
});

// Handle Login
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    // Check credentials
    const user = users.find(
        (user) => user.email === email && user.password === password
    );

    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        currentUser = user;
        document.getElementById("currentUsername").textContent = user.username;
        showScreen("chatScreen");
        e.target.reset();
    } else {
        alert("Invalid credentials!");
    }
});

// Handle Logout
function logout() {
    localStorage.removeItem("currentUser");
    currentUser = null;
    showScreen("welcomeScreen");
}

// Chat Functionality
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const messageContainer = document.getElementById("messageContainer");

sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});

function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        // Create new message element
        const messageElement = document.createElement("div");
        messageElement.className = "message sent";
        messageElement.innerHTML = `
            <div class="message-content">${message}</div>
            <div class="message-avatar"></div>
        `;

        // Add message to container
        messageContainer.appendChild(messageElement);

        // Clear input
        messageInput.value = "";

        // Scroll to bottom
        messageContainer.scrollTop = messageContainer.scrollHeight;

        // Simulate received message after 1 second
        setTimeout(() => {
            const receivedMessage = document.createElement("div");
            receivedMessage.className = "message received";
            receivedMessage.innerHTML = `
                <div class="message-avatar"></div>
                <div class="message-content">This is a demo response!</div>
            `;
            messageContainer.appendChild(receivedMessage);
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }, 1000);
    }
}

// Handle chat item clicks
document.querySelectorAll(".chat-item").forEach((item) => {
    item.addEventListener("click", function () {
        document.querySelector(".chat-item.active")?.classList.remove("active");
        this.classList.add("active");
    });
});
