from flask import Flask, render_template, request, jsonify
from deepface import DeepFace
import os
import base64
from datetime import datetime

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():

    image = request.json['image']

    image_data = image.split(",")[1]

    filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}.png"

    filepath = os.path.join(UPLOAD_FOLDER, filename)

    with open(filepath, "wb") as f:
        f.write(base64.b64decode(image_data))

    try:

        result = DeepFace.analyze(
            img_path=filepath,
            actions=['emotion'],
            enforce_detection=False
        )

        emotion = result[0]['dominant_emotion']

        emoji_map = {
            "happy": "😊",
            "sad": "😢",
            "angry": "😠",
            "surprise": "😲",
            "neutral": "😐",
            "fear": "😨",
            "disgust": "🤢"
        }

        emoji = emoji_map.get(emotion, "🙂")

        return jsonify({
            "success": True,
            "emotion": emotion.capitalize(),
            "emoji": emoji
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        })

if __name__ == '__main__':
    app.run(debug=True)