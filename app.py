from flask import Flask, jsonify
import subprocess
import sys
import os

app = Flask(__name__)

@app.route("/")
def home():
    return "Welcome to the Voice Assistant App!"

@app.route('/start-voice-ui', methods=['POST'])
def start_voice_ui():
    """Launch the voice_ui.py script"""
    try:
        # Use the same Python executable and ensure the correct path to voice_ui.py
        python_executable = sys.executable
        script_path = os.path.join(os.getcwd(), 'voice_ui.py')  # Corrected filename
        
        # Start the voice_ui.py script in a new process
        subprocess.Popen([python_executable, script_path], cwd=os.getcwd())
        
        return jsonify({'message': 'Voice Assistant started successfully'}), 200
    except Exception as e:
        return jsonify({'error': f"Failed to start Voice Assistant: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
