const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const preview = document.getElementById("preview");
const result = document.getElementById("result");

let capturedImage = "";

async function startCamera() {

    const stream =
        await navigator.mediaDevices.getUserMedia({
            video: true
        });

    video.srcObject = stream;
    video.style.display = "block";
}

function capturePhoto() {

    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0);

    capturedImage =
        canvas.toDataURL("image/png");

    preview.src = capturedImage;
    video.style.display = "none";
}

async function analyzeEmotion() {

    if (!capturedImage) {
        alert("Capture image first");
        return;
    }

    result.innerHTML = "🧠 Detecting Emotion...";

    const response =
        await fetch("/analyze", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                image: capturedImage
            })
        });

    const data = await response.json();

    if (data.success) {

        result.innerHTML =
            `${data.emoji} ${data.emotion}`;

        if (data.emotion === "Happy") {
            result.style.color = "#22c55e";
        }

        else if (data.emotion === "Sad") {
            result.style.color = "#38bdf8";
        }

        else if (data.emotion === "Angry") {
            result.style.color = "#ef4444";
        }

        else {
            result.style.color = "white";
        }

    } else {

        result.innerHTML =
            `Error: ${data.error}`;
    }
}