/* =========================================================
   PHOTOBOOTH CAMERA MODULE
   Handles Camera + Capture Flow
========================================================= */

/* ==========================================
   CAMERA STATE
========================================== */

let localStream = null;
let countdownTimer = null;

let camera = null;
let captureCanvas = null;
let countdown = null;
let flash = null;

/* ==========================================
   INITIALIZE
========================================== */
function initCamera() {

    camera = document.getElementById("camera");
    captureCanvas = document.getElementById("captureCanvas");
    countdown = document.getElementById("countdown");
    flash = document.getElementById("flash");

    if (!camera) {
        console.error("❌ Camera video element missing (#camera)");
        return;
    }

    // ✅ ADD THESE HERE
    camera.muted = true;
    camera.playsInline = true;

    console.log("📷 Camera initialized");
}

/* ==========================================
   START CAMERA
========================================== */

async function startCamera() {

    if (!camera) {
        console.error("Camera not ready after init");
        return false;
    }

    if (!navigator.mediaDevices?.getUserMedia) {

        alert("Your browser does not support camera access.");

        return false;

    }

    try {

        stopCamera();

        localStream = await navigator.mediaDevices.getUserMedia({

            video: {

                facingMode: "user",

                width: { ideal: 1280 },

                height: { ideal: 720 }

            },

            audio: false

        });

        camera.srcObject = localStream;
        camera.style.filter = getCurrentFilter().css;
        try {
            await camera.play();
        } catch (err) {
            console.warn("Camera play blocked, retrying muted:", err);

            camera.muted = true;
            await camera.play();
        }

        booth.stream = localStream;
        booth.cameraStarted = true;

        syncModules?.();

        console.log("✅ Camera started");

        return true;

    }

    catch (err) {

        console.error(err);

        alert("Unable to access the camera.");

        return false;

    }

}

/* ==========================================
   STOP CAMERA
========================================== */

function stopCamera() {

    if (countdownTimer) {

        clearInterval(countdownTimer);

        countdownTimer = null;

    }

    if (localStream) {

        localStream.getTracks().forEach(track => track.stop());

    }

    localStream = null;

    if (camera) {

        camera.pause();

        camera.srcObject = null;

    }

    booth.stream = null;
    booth.cameraStarted = false;
    booth.isCapturing = false;

    syncModules?.();

}

/* ==========================================
   BEGIN CAPTURE
========================================== */

function beginCapture() {

    if (!booth.cameraStarted) return;

    booth.isCapturing = true;

    booth.currentPhoto = 0;

    resetPhotos();

    syncModules?.();

    captureNextPhoto();

}

/* ==========================================
   NEXT PHOTO
========================================== */

function captureNextPhoto() {

    if (!booth.isCapturing) return;

    if (booth.currentPhoto >= booth.requiredPhotos) {

        booth.isCapturing = false;

        syncModules?.();

        return;

    }

    startCountdown();

}

/* ==========================================
   COUNTDOWN
========================================== */

function startCountdown(seconds = 3) {

    let value = seconds;

    countdown.classList.remove("hidden");

    countdown.textContent = value;

    audio.playCountdown();

    countdownTimer = setInterval(() => {

        value--;

        if (value > 0) {

            countdown.textContent = value;

            audio.playCountdown();

            return;

        }

        clearInterval(countdownTimer);

        countdownTimer = null;

        countdown.textContent = "📸";

        setTimeout(() => {

            countdown.classList.add("hidden");

            takeSnapshot();

        }, 300);

    }, 1000);

}

/* ==========================================
   SNAPSHOT
========================================== */

async function takeSnapshot() {

    if (!camera.videoWidth) return;

    captureCanvas.width = camera.videoWidth;
    captureCanvas.height = camera.videoHeight;

    const ctx = captureCanvas.getContext("2d");

    flash?.classList.add("active");

    setTimeout(() => {

        flash?.classList.remove("active");

    }, 150);

    audio.playShutter();

    ctx.save();

    ctx.translate(captureCanvas.width, 0);

    ctx.scale(-1, 1);

    ctx.drawImage(

        camera,

        0,

        0,

        captureCanvas.width,

        captureCanvas.height

    );

    ctx.restore();

    savePhoto(

        booth.currentPhoto,

        captureCanvas.toDataURL("image/png")

    );

    booth.currentPhoto++;

    refreshStripCanvas?.();

    if (booth.currentPhoto < booth.requiredPhotos) {

        setTimeout(captureNextPhoto, 700);

    }

    else {

        booth.isCapturing = false;

        syncModules?.();

    }

}

/* ==========================================
   RETAKE
========================================== */

function retakePhoto(index) {

    if (booth.isCapturing) return;

    booth.currentPhoto = index;

    booth.isCapturing = true;

    captureNextPhoto();

}

/* ==========================================
   EXPORTS
========================================== */

window.initCamera = initCamera;

window.startCamera = startCamera;

window.stopCamera = stopCamera;

window.beginCapture = beginCapture;

window.retakePhoto = retakePhoto;

console.log("📷 photobooth-camera.js loaded");