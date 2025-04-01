import os
import sys
import tkinter as tk
from tkinter import scrolledtext
import threading
import queue  # Add queue for thread-safe communication
import pyttsx3
import speech_recognition as sr
from google import genai

# Set Gemini API key
gemini_api_key = "AIzaSyBqM3-A1vo1BSq7ZgLv9A1_Tit0vp984Bs"  # Replace with your Gemini API key

# Initialize speech recognition and text-to-speech engine
recognizer = sr.Recognizer()
engine = pyttsx3.init()

# Initialize the genai client with your API key
client = genai.Client(api_key=gemini_api_key)

# Create a queue for thread-safe communication
message_queue = queue.Queue()

def speak(text):
    """Convert text to speech"""
    engine.say(text)
    engine.runAndWait()

def listen():
    """Capture user's voice input and convert it to text"""
    with sr.Microphone() as source:
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)
    
    try:
        text = recognizer.recognize_google(audio)
        return text
    except sr.UnknownValueError:
        return "Couldn't understand, please try again."
    except sr.RequestError:
        return "Speech recognition service unavailable."

def chat_with_gemini(user_input):
    """Send user input to Gemini API and get a response"""
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=user_input
        )
        ai_reply = response.text
        speak(ai_reply)
        return ai_reply
    except Exception as e:
        return f"Error with Gemini API: {e}"

def process_queue(output_text):
    """Process messages from the queue and update the GUI"""
    while not message_queue.empty():
        message = message_queue.get()
        output_text.insert(tk.END, message + "\n")
        output_text.see(tk.END)  # Scroll to the bottom

def start_conversation(output_text):
    """Start the conversation in a separate thread"""
    user_input = listen()
    message_queue.put(f"You: {user_input}")
    if user_input.lower() in ["exit", "quit", "stop"]:
        speak("Goodbye! Have a great day.")
        message_queue.put("Assistant: Goodbye! Have a great day.")
        return

    response = chat_with_gemini(user_input)
    message_queue.put(f"Assistant: {response}")

def update_gui(output_text):
    """Update the GUI periodically to process the queue"""
    process_queue(output_text)
    output_text.after(100, update_gui, output_text)  # Schedule the next update

def create_gui():
    """Create the GUI for the voice assistant"""
    root = tk.Tk()
    root.title("Voice Assistant")
    root.geometry("500x400")
    root.resizable(False, False)

    # Add a title label
    title_label = tk.Label(root, text="Voice Assistant", font=("Helvetica", 16, "bold"))
    title_label.pack(pady=10)

    # Add a scrolled text widget to display conversation
    output_text = scrolledtext.ScrolledText(root, wrap=tk.WORD, font=("Helvetica", 12), height=15, width=55)
    output_text.pack(pady=10)
    output_text.insert(tk.END, "Assistant: Hello! How can I assist you today?\n")

    # Add a microphone button
    mic_button = tk.Button(
        root, text="🎤 Speak", font=("Helvetica", 14), bg="#4CAF50", fg="white",
        command=lambda: threading.Thread(target=start_conversation, args=(output_text,)).start()
    )
    mic_button.pack(pady=10)

    # Start the periodic GUI update
    update_gui(output_text)

    root.mainloop()

if __name__ == "__main__":
    # Prevent multiple instances of the script
    pid_file = "voice_ui.pid"
    if os.path.exists(pid_file):
        print("Voice Assistant is already running.")
        sys.exit(1)
    try:
        with open(pid_file, "w") as f:
            f.write(str(os.getpid()))
        create_gui()  # Ensure the GUI launches when the script is executed
    except Exception as e:
        print(f"Error launching Voice Assistant GUI: {e}")
    finally:
        if os.path.exists(pid_file):
            os.remove(pid_file)