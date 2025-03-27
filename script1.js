let promptInput = document.querySelector("#prompt");
let chatContainer = document.querySelector(".chat-container"); // Fix selector
let sendBtn = document.querySelector("#send-btn");

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAQzlPh-LGdc-CLAQ1RHHsHES5yNwI3Brw";

function createChatBox(html, className) {
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(className);
    return div;
}

// Generate AI Response
async function generateResponse(aiChatBox, message) {
    let text = aiChatBox.querySelector(".ai-chat-area");

    let requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "contents": [{ "parts": [{ "text": message }] }]
        })
    };

    try {
        let response = await fetch(API_URL, requestOptions);
        let data = await response.json();

        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts.length > 0) {
            let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
            text.innerHTML = apiResponse;
        } else {
            text.innerHTML = "Sorry, I couldn't understand that.";
        }
    } catch (error) {
        console.error(error);
        text.innerHTML = "Error fetching response.";
    } finally {
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
    }
}

// Handle User Input
function handleChatResponse(message) {
    let userHtml = `
        <div class="user-chat-box">
            <div class="user-chat-area">${message}</div>
        </div>`;

    let userChatBox = createChatBox(userHtml, "user-chat-box");
    chatContainer.appendChild(userChatBox);
    promptInput.value = "";

    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });

    setTimeout(() => {
        let aiHtml = `
        <div class="ai-chat-box">
            <img src="assests/assistant-svgrepo-com.svg" alt="Bot" id="aimage" width="50">
            <div class="ai-chat-area">
                <img src="assests/Spinner@1x-1.0s-200px-200px.svg" alt="Loading" class="load" width="30">
            </div>
        </div>`;

        let aiChatBox = createChatBox(aiHtml, "ai-chat-box");
        chatContainer.appendChild(aiChatBox);

        generateResponse(aiChatBox, message);
    }, 600);
}

// Event Listeners
sendBtn.addEventListener("click", () => {
    if (promptInput.value.trim() !== "") {
        handleChatResponse(promptInput.value);
    }
});

promptInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        if (promptInput.value.trim() !== "") {
            handleChatResponse(promptInput.value);
        }
    }
});
