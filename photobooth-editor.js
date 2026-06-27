/* =========================================================
   PHOTOBOOTH EDITOR MODULE
   PART 1A.1 - STATE + INITIALIZATION (SAFE MERGED VERSION)
========================================================= */

/* ==========================================
   EDITOR STATE
========================================== */
const editor = {
    selectedIndex: -1,
    dragging: false,
    lastX: 0,
    lastY: 0,
    touchDistance: 0,
    initialized: false
};

/* DOM */
let editorCanvas = null;

/* ==========================================
   INITIALIZE
========================================== */
function initEditor() {
    if (editor.initialized) return;

    editorCanvas = document.getElementById("stripCanvas");

    if (!editorCanvas) {
        console.error("❌ stripCanvas not found.");
        return;
    }

    bindEditorEvents();
    bindKeyboardControls();

    editor.initialized = true;

    console.log("🖱️ Editor initialized");
}

window.initEditor = initEditor;

/* ==========================================
   SAFE HELPERS (MERGED CONTRACT LAYER)
========================================== */

function getPhoto(index) {
    return booth.photos?.[index] || null;
}

function getSlot(index) {
    const layout = getCurrentLayout();
    if (!layout) return null;
    return layout.slots?.[index] || null;
}

function clampOffset(photo, slot) {
    if (!photo || !slot) return;

    const zoom = photo.zoom ?? 1;

    const maxX = (slot.w * (zoom - 1)) / 2;
    const maxY = (slot.h * (zoom - 1)) / 2;

    photo.xOffset = Math.max(-maxX, Math.min(maxX, photo.xOffset || 0));
    photo.yOffset = Math.max(-maxY, Math.min(maxY, photo.yOffset || 0));
}

/* ==========================================
   EVENT BINDING
========================================== */
function bindEditorEvents() {

    editorCanvas.addEventListener("click", handleCanvasClick);
    editorCanvas.addEventListener("mousedown", onMouseDown);
    editorCanvas.addEventListener("wheel", onMouseWheel, { passive: false });

    editorCanvas.addEventListener("touchstart", onTouchStart, { passive: false });
    editorCanvas.addEventListener("touchmove", onTouchMove, { passive: false });
    editorCanvas.addEventListener("touchend", onTouchEnd);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
}

/* ==========================================
   CANVAS POSITION
========================================== */
function getCanvasMouse(event) {

    const rect = editorCanvas.getBoundingClientRect();

    const scaleX = editorCanvas.width / rect.width;
    const scaleY = editorCanvas.height / rect.height;

    return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
    };
}

/* ==========================================
   SELECT PHOTO
========================================== */
function selectPhotoAt(x, y) {

    const layout = getCurrentLayout();

    if (!layout) {
        editor.selectedIndex = -1;
        return false;
    }

    editor.selectedIndex = -1;

    for (let i = 0; i < layout.slots.length; i++) {

        const slot = layout.slots[i];
        const photo = getPhoto(i);

        if (!photo || !photo.src) continue;

        if (
            x >= slot.x &&
            x <= slot.x + slot.w &&
            y >= slot.y &&
            y <= slot.y + slot.h
        ) {
            editor.selectedIndex = i;
            return true;
        }
    }

    return false;
}

/* ==========================================
   MOUSE DOWN
========================================== */
function onMouseDown(event) {

    const mouse = getCanvasMouse(event);

    if (!selectPhotoAt(mouse.x, mouse.y)) {
        refreshStripCanvas();
        return;
    }

    editor.dragging = true;
    editor.lastX = mouse.x;
    editor.lastY = mouse.y;

    refreshStripCanvas();
}

/* ==========================================
   MOUSE MOVE
========================================== */
function onMouseMove(event) {

    if (!editor.dragging) return;

    const photo = getPhoto(editor.selectedIndex);
    const slot = getSlot(editor.selectedIndex);

    if (!photo || !photo.src || !slot) {
        editor.dragging = false;
        return;
    }

    const mouse = getCanvasMouse(event);

    const dx = mouse.x - editor.lastX;
    const dy = mouse.y - editor.lastY;

    photo.xOffset = (photo.xOffset || 0) + dx;
    photo.yOffset = (photo.yOffset || 0) + dy;

    clampOffset(photo, slot);

    editor.lastX = mouse.x;
    editor.lastY = mouse.y;

    refreshStripCanvas();
}

/* ==========================================
   MOUSE UP
========================================== */
function onMouseUp() {
    editor.dragging = false;
}

/* ==========================================
   MOUSE WHEEL ZOOM
========================================== */
function onMouseWheel(event) {

    if (editor.selectedIndex < 0) return;

    event.preventDefault();

    const photo = getPhoto(editor.selectedIndex);
    const slot = getSlot(editor.selectedIndex);

    if (!photo || !photo.src || !slot) return;

    const mouse = getCanvasMouse(event);

    const currentZoom = photo.zoom || 1;
    const delta = -event.deltaY * 0.0015;

    const newZoom = Math.max(1, Math.min(3, currentZoom + delta));
    const ratio = newZoom / currentZoom;

    photo.xOffset =
        (photo.xOffset - (mouse.x - slot.x)) * ratio +
        (mouse.x - slot.x);

    photo.yOffset =
        (photo.yOffset - (mouse.y - slot.y)) * ratio +
        (mouse.y - slot.y);

    photo.zoom = newZoom;

    clampOffset(photo, slot);

    refreshStripCanvas();
}

/* ==========================================
   TOUCH HELPERS
========================================== */
function getTouchPos(touch) {

    const rect = editorCanvas.getBoundingClientRect();

    return {
        x: (touch.clientX - rect.left) * (editorCanvas.width / rect.width),
        y: (touch.clientY - rect.top) * (editorCanvas.height / rect.height)
    };
}

function getTouchDistance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

function getTouchCenter(a, b) {
    return {
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2
    };
}

/* ==========================================
   TOUCH START
========================================== */
function onTouchStart(event) {

    event.preventDefault();

    const touches = event.touches;

    if (touches.length === 1) {

        const pos = getTouchPos(touches[0]);

        if (!selectPhotoAt(pos.x, pos.y)) {
            refreshStripCanvas();
            return;
        }

        editor.dragging = true;
        editor.lastX = pos.x;
        editor.lastY = pos.y;

        refreshStripCanvas();
    }

    if (touches.length === 2 && editor.selectedIndex >= 0) {

        const p1 = getTouchPos(touches[0]);
        const p2 = getTouchPos(touches[1]);

        editor.touchDistance = getTouchDistance(p1, p2);
    }
}

/* ==========================================
   TOUCH MOVE
========================================== */
function onTouchMove(event) {

    event.preventDefault();

    const touches = event.touches;

    const photo = getPhoto(editor.selectedIndex);
    const slot = getSlot(editor.selectedIndex);

    if (!photo || !photo.src || !slot) return;

    /* DRAG */
    if (touches.length === 1 && editor.dragging) {

        const pos = getTouchPos(touches[0]);

        const dx = pos.x - editor.lastX;
        const dy = pos.y - editor.lastY;

        photo.xOffset = (photo.xOffset || 0) + dx;
        photo.yOffset = (photo.yOffset || 0) + dy;

        clampOffset(photo, slot);

        editor.lastX = pos.x;
        editor.lastY = pos.y;

        refreshStripCanvas();
        return;
    }

    /* PINCH */
    if (touches.length === 2) {

        const p1 = getTouchPos(touches[0]);
        const p2 = getTouchPos(touches[1]);

        const distance = getTouchDistance(p1, p2);

        const currentZoom = photo.zoom || 1;

        const scale =
            editor.touchDistance > 0
                ? distance / editor.touchDistance
                : 1;

        const newZoom = Math.max(1, Math.min(3, currentZoom * scale));
        const ratio = newZoom / currentZoom;

        const center = getTouchCenter(p1, p2);

        photo.xOffset =
            (photo.xOffset - (center.x - slot.x)) * ratio +
            (center.x - slot.x);

        photo.yOffset =
            (photo.yOffset - (center.y - slot.y)) * ratio +
            (center.y - slot.y);

        photo.zoom = newZoom;

        clampOffset(photo, slot);

        editor.touchDistance = distance;

        refreshStripCanvas();
    }
}

/* ==========================================
   TOUCH END
========================================== */
function onTouchEnd(event) {

    if (event.touches.length === 0) {
        editor.dragging = false;
        editor.touchDistance = 0;
    }
}

/* ==========================================
   OVERLAY
========================================== */
function drawEditorOverlay() {

    if (editor.selectedIndex < 0) return;

    const slot = getSlot(editor.selectedIndex);
    if (!slot) return;

    stripCtx.save();

    stripCtx.strokeStyle = "rgba(0,168,255,0.9)";
    stripCtx.lineWidth = 6;
    stripCtx.setLineDash([10, 6]);

    stripCtx.strokeRect(slot.x, slot.y, slot.w, slot.h);

    stripCtx.restore();
}

/* ==========================================
   CLICK
========================================== */
function handleCanvasClick(event) {

    const mouse = getCanvasMouse(event);

    selectPhotoAt(mouse.x, mouse.y);

    refreshStripCanvas();
}

/* ==========================================
   HELPERS
========================================== */
function getSelectedPhoto() {
    return getPhoto(editor.selectedIndex);
}

function getSelectedPhotoIndex() {
    return editor.selectedIndex;
}

function clearPhotoSelection() {
    editor.selectedIndex = -1;
    refreshStripCanvas();
}

/* ==========================================
   PHOTO ACTIONS
========================================== */
function resetPhoto() {

    const photo = getSelectedPhoto();
    if (!photo) return;

    photo.zoom = 1;
    photo.xOffset = 0;
    photo.yOffset = 0;

    refreshStripCanvas();
}

function centerPhoto() {

    const photo = getSelectedPhoto();
    if (!photo) return;

    photo.xOffset = 0;
    photo.yOffset = 0;

    refreshStripCanvas();
}

function deletePhoto() {

    if (editor.selectedIndex < 0) return;

    booth.photos[editor.selectedIndex] = null;

    editor.selectedIndex = -1;
    editor.dragging = false;

    if (typeof syncUI === "function") syncUI();

    refreshStripCanvas();
}

/* ==========================================
   KEYBOARD
========================================== */
let keyboardBound = false;

function bindKeyboardControls() {

    if (keyboardBound) return;

    keyboardBound = true;

    window.addEventListener("keydown", handleKeyboard);
}

function handleKeyboard(event) {

    if (editor.selectedIndex < 0) return;

    event.preventDefault();

    switch (event.key.toLowerCase()) {

        case "r":
            resetPhoto();
            break;

        case "c":
            centerPhoto();
            break;

        case "delete":
        case "backspace":
            deletePhoto();
            break;
    }
}

/* ==========================================
   EXPORTS
========================================== */
window.drawEditorOverlay = drawEditorOverlay;
window.getSelectedPhoto = getSelectedPhoto;
window.getSelectedPhotoIndex = getSelectedPhotoIndex;
window.clearPhotoSelection = clearPhotoSelection;
window.resetPhoto = resetPhoto;
window.centerPhoto = centerPhoto;
window.deletePhoto = deletePhoto;

/* ==========================================
   INIT
========================================== */
document.addEventListener("DOMContentLoaded", initEditor);

console.log("🖱️ photobooth-editor.js loaded");