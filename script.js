// Store users data and conversations
let users = JSON.parse(localStorage.getItem("users")) || [];
let conversations = JSON.parse(localStorage.getItem("conversations")) || {};
let currentUser = JSON.parse(localStorage.getItem("currentUser"));
let activeChat = localStorage.getItem("activeChat") || null;

// Screen management
function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach((screen) => {
        screen.classList.add("hidden");
    });
    document.getElementById(screenId).classList.remove("hidden");

    // Clear signup form when showing signup screen
    if (screenId === "signupScreen") {
        const signupForm = document.getElementById("signupForm");
        if (signupForm) {
            signupForm.reset();
            // Clear individual input fields to ensure they're empty
            document.getElementById("signupUsername").value = "";
            document.getElementById("signupEmail").value = "";
            document.getElementById("signupPassword").value = "";
        }
    }

    // Clear login form when showing login screen
    if (screenId === "loginScreen") {
        const loginForm = document.getElementById("loginForm");
        if (loginForm) {
            loginForm.reset();
            // Clear individual input fields
            document.getElementById("loginEmail").value = "";
            document.getElementById("loginPassword").value = "";
        }
    }
}

// Initialize conversations for existing users if needed
users.forEach((user) => {
    if (!conversations[user.username]) {
        conversations[user.username] = [];
    }
});

// Handle chat item clicks with conversation loading
document.querySelectorAll(".chat-item").forEach((item) => {
    item.addEventListener("click", function () {
        document.querySelector(".chat-item.active")?.classList.remove("active");
        this.classList.add("active");

        // Get the username from the clicked chat item
        const chatUsername = this.querySelector("span").textContent.trim();
        activeChat = chatUsername;
        localStorage.setItem("activeChat", activeChat);

        // Load and display conversation
        loadConversation(chatUsername);
    });
});

function loadConversation(username) {
    const messageContainer = document.getElementById("messageContainer");
    // Clear current messages
    messageContainer.innerHTML = "";

    // Update chat header
    document.querySelector(
        ".chat-header span"
    ).textContent = `To : ${username}`;

    // Load and display messages for this conversation
    if (conversations[username]) {
        conversations[username].forEach((message) => {
            const messageElement = document.createElement("div");
            messageElement.className = `message ${message.type}`;
            messageElement.innerHTML = `
                ${
                    message.type === "sent"
                        ? ""
                        : '<div class="message-avatar"></div>'
                }
                <div class="message-content">${message.content}</div>
                ${
                    message.type === "sent"
                        ? '<div class="message-avatar"></div>'
                        : ""
                }
            `;
            messageContainer.appendChild(messageElement);
        });
    }

    // Scroll to bottom
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// Handle message sending
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});

function sendMessage() {
    const message = messageInput.value.trim();
    if (message && activeChat) {
        // Create message object
        const messageObj = {
            content: message,
            type: "sent",
            timestamp: new Date().toISOString(),
        };

        // Add to conversations
        if (!conversations[activeChat]) {
            conversations[activeChat] = [];
        }
        conversations[activeChat].push(messageObj);

        // Save to localStorage
        localStorage.setItem("conversations", JSON.stringify(conversations));

        // Create and display message element
        const messageElement = document.createElement("div");
        messageElement.className = "message sent";
        messageElement.innerHTML = `
            <div class="message-content">${message}</div>
            <div class="message-avatar"></div>
        `;

        const messageContainer = document.getElementById("messageContainer");
        messageContainer.appendChild(messageElement);
        messageInput.value = "";
        messageContainer.scrollTop = messageContainer.scrollHeight;

        // Simulate received message
        setTimeout(() => {
            const receivedObj = {
                content: "What's upp broh!",
                type: "received",
                timestamp: new Date().toISOString(),
            };

            conversations[activeChat].push(receivedObj);
            localStorage.setItem(
                "conversations",
                JSON.stringify(conversations)
            );

            const receivedMessage = document.createElement("div");
            receivedMessage.className = "message received";
            receivedMessage.innerHTML = `
                <div class="message-avatar"></div>
                <div class="message-content">What's upp broh!</div>
            `;
            messageContainer.appendChild(receivedMessage);
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }, 1000);
    }
}

// Handle signup
document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("signupUsername").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    if (users.find((user) => user.email === email)) {
        alert("User already exists!");
        return;
    }

    const newUser = { username, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Initialize empty conversation for new user
    conversations[username] = [];
    localStorage.setItem("conversations", JSON.stringify(conversations));

    e.target.reset();
    showScreen("loginScreen");
});

// Handle login
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const user = users.find(
        (user) => user.email === email && user.password === password
    );

    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        currentUser = user;

        // Initialize conversation storage for new user
        if (!conversations[user.username]) {
            conversations[user.username] = [];
            localStorage.setItem(
                "conversations",
                JSON.stringify(conversations)
            );
        }

        document.getElementById("currentUsername").textContent = user.username;
        showScreen("chatScreen");
        e.target.reset();

        // Set initial active chat and load conversation
        const firstChatItem = document.querySelector(".chat-item");
        if (firstChatItem) {
            activeChat = firstChatItem.querySelector("span").textContent.trim();
            localStorage.setItem("activeChat", activeChat);
            loadConversation(activeChat);
            firstChatItem.classList.add("active");
        }
    } else {
        alert("Invalid credentials!");
    }
});

// Handle logout
function logout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("activeChat");
    currentUser = null;
    activeChat = null;
    showScreen("welcomeScreen");
}

// Initial setup when page loads
window.addEventListener("load", () => {
    if (currentUser) {
        document.getElementById("currentUsername").textContent =
            currentUser.username;
        showScreen("chatScreen");

        // Load active chat if exists, otherwise load first chat
        if (activeChat) {
            loadConversation(activeChat);
            const activeChatElement = Array.from(
                document.querySelectorAll(".chat-item span")
            )
                .find((span) => span.textContent.trim() === activeChat)
                ?.closest(".chat-item");
            if (activeChatElement) {
                activeChatElement.classList.add("active");
            }
        } else {
            const firstChatItem = document.querySelector(".chat-item");
            if (firstChatItem) {
                activeChat = firstChatItem
                    .querySelector("span")
                    .textContent.trim();
                localStorage.setItem("activeChat", activeChat);
                loadConversation(activeChat);
                firstChatItem.classList.add("active");
            }
        }
    }
});
