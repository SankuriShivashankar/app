import pyttsx3
import speech_recognition as sr
from google import genai
import tkinter as tk
from tkinter import messagebox

# Set Gemini API key
gemini_api_key = "AIzaSyBqM3-A1vo1BSq7ZgLv9A1_Tit0vp984Bs"  # Replace with your Gemini API key

# Initialize speech recognition and text-to-speech engine
recognizer = sr.Recognizer()
engine = pyttsx3.init()

# Initialize the genai client with your API key
client = genai.Client(api_key=gemini_api_key)

def speak(text):
    """Convert text to speech"""
    engine.say(text)
    engine.runAndWait()

def listen():
    """Capture user's voice input and convert it to text"""
    with sr.Microphone() as source:
        print("Listening...")
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)
    
    try:
        text = recognizer.recognize_google(audio)
        print(f"You: {text}")
        return text
    except sr.UnknownValueError:
        print("Couldn't understand, please try again.")
        return ""
    except sr.RequestError:
        print("Speech recognition service unavailable.")
        return ""

def chat_with_gemini(user_input):
    """Send user input to Gemini API and get response"""
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=user_input
        )
        return response.text
    except Exception as e:
        print(f"Error with Gemini API: {e}")
        return "Sorry, I couldn't process that."

def on_mic_button_click():
    """Handle microphone button click"""
    user_input = listen()
    if user_input.lower() in ["exit", "quit", "stop"]:
        speak("Goodbye! Have a great day.")
        root.quit()
    else:
        ai_reply = chat_with_gemini(user_input)
        print("Gemini AI:", ai_reply)
        speak(ai_reply)
        messagebox.showinfo("Gemini AI", ai_reply)

# Create the GUI
root = tk.Tk()
root.title("Voice Assistant")
root.geometry("300x200")

mic_button = tk.Button(root, text="🎤 Speak", command=on_mic_button_click)
mic_button.pack(pady=20)

root.mainloop()