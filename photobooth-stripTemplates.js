/* =========================================================
   PHOTOBOOTH STRIP TEMPLATE ENGINE (SAFE FIXED VERSION)
========================================================= */

/* ==========================================
   CANVAS (SAFE INIT FIX)
========================================== */

let stripCanvas = null;
let stripCtx = null;
let framesLoaded = false;

async function initializeStripCanvas() {

    stripCanvas = document.getElementById("stripCanvas");

    if (!stripCanvas) {
        console.warn("Strip canvas not found.");
        return;
    }

    stripCtx = stripCanvas.getContext("2d");

    stripCanvas.width = 1080;
    stripCanvas.height = 3240;

    if (!framesLoaded) {

        await preloadFrames();

        framesLoaded = true;

    }

    refreshStripCanvas();

}

window.initializeStripCanvas = initializeStripCanvas;

/* ==========================================
   TEMPLATES
========================================== */

const STRIP_TEMPLATES = {
    1: "assets/frame1.png",
    2: "assets/frame2.png",
    3: "assets/frame3.png",
    4: "assets/frame4.png"
};

/* ==========================================
   LAYOUTS
========================================== */

const STRIP_LAYOUTS = {
    1: {
        slots: [
            { x:387, y:0, w:750, h:810 },
            { x:387, y:810, w:750, h:810 },
            { x:387, y:1620, w:750, h:810 },
            { x:387, y:2430, w:750, h:810 }
        ]
    },
    2: {
        slots: [
            { rotate:-90, x:202, y:2167, w:677, h:1073 },
            { rotate:-90, x:202, y:1094, w:677, h:1073 },
            { rotate:-90, x:202, y:21, w:677, h:1073 }
        ]
    },
    3: {
        slots: [
            { x:118, y:88, w:843, h:860 },
            { x:118, y:994, w:843, h:860 },
            { x:118, y:1900, w:843, h:860 }
        ]
    },
    4: {
        slots: [
            { x:19, y:19, w:1043, h:759 },
            { x:19, y:794, w:1043, h:759 },
            { x:19, y:1569, w:1043, h:759 },
            { x:19, y:2344, w:1043, h:759 }
        ]
    }
};

/* ==========================================
   FRAME CACHE
========================================== */

const frameCache = {};
const imageCache = {};

/* ==========================================
   HELPERS
========================================== */

function getCurrentLayout() {
    return STRIP_LAYOUTS[booth.currentStrip];
}

/* ==========================================
   PRELOAD FRAMES
========================================== */

async function preloadFrames() {

    const entries = Object.entries(STRIP_TEMPLATES);

    await Promise.all(entries.map(([id, src]) => {

        return new Promise((resolve) => {

            const img = new Image();

            img.onload = () => {
                frameCache[id] = img;
                resolve();
            };

            img.src = src;
        });
    }));
}

/* ==========================================
   MAIN RENDER (SAFE)
========================================== */

function refreshStripCanvas() {

    if (!stripCtx) return;

    clearStripCanvas();
    drawPhotos();
    drawFrame();

    if (typeof drawEditorOverlay === "function") {
        drawEditorOverlay();
    }
}

/* ==========================================
   CLEAR
========================================== */

function clearStripCanvas() {

    stripCtx.clearRect(0, 0, 1080, 3240);
}

/* ==========================================
   DRAW PHOTOS (SAFE)
========================================== */
function drawPhotos() {

    const layout = getCurrentLayout();
    if (!layout) return;

    for (let i = 0; i < layout.slots.length; i++) {

        const photo = booth.photos[i];
        if (!photo || !photo.src) {
            continue;
        }

        const slot = layout.slots[i];

        const img = getCachedImage(photo.src);
        if (!img || !img.complete) continue;

        const zoom = photo.zoom || 1;
        const offsetX = photo.xOffset || 0;
        const offsetY = photo.yOffset || 0;

        // 👉 FIX 1: preserve real image ratio
        const imgRatio = img.width / img.height;
        const slotRatio = slot.w / slot.h;

        let drawW, drawH;

        if (imgRatio > slotRatio) {
            // image is wider
            drawH = slot.h * zoom;
            drawW = drawH * imgRatio;
        } else {
            // image is taller
            drawW = slot.w * zoom;
            drawH = drawW / imgRatio;
        }

        const x = slot.x + offsetX - (drawW - slot.w) / 2;
        const y = slot.y + offsetY - (drawH - slot.h) / 2;

        stripCtx.save();
        applyCanvasFilter(
            stripCtx,
            photo.filter
        );

        stripCtx.beginPath();
        stripCtx.rect(slot.x, slot.y, slot.w, slot.h);
        stripCtx.clip();

        stripCtx.drawImage(img, x, y, drawW, drawH);

        stripCtx.restore();
    }
}

/* ==========================================
   IMAGE CACHE SAFE
========================================== */

function getCachedImage(src) {

    if (!src) return null;

    if (imageCache[src]) return imageCache[src];

    const img = new Image();
    img.src = src;

    imageCache[src] = img;

    return img;
}

/* ==========================================
   FRAME
========================================== */

function drawFrame() {

    const frame = frameCache[booth.currentStrip];
    if (!frame) return;

    stripCtx.drawImage(frame, 0, 0, 1080, 3240);
}

/* ==========================================
   EXPORT
========================================== */
function allPhotosCaptured() {

    return booth.photos.every(
        photo => photo && photo.src
    );

}

function exportStripCanvas() {

    return stripCanvas.toDataURL("image/png");

}

window.refreshStripCanvas = refreshStripCanvas;
window.exportStripCanvas = exportStripCanvas;
window.allPhotosCaptured = allPhotosCaptured;

console.log("🧩 strip engine loaded");