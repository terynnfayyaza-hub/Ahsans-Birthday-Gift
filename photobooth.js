/* =========================================================
   PHOTOBOOTH MAIN CONTROLLER
   Single Source of Truth
========================================================= */

/* ==========================================
   APPLICATION STATE
========================================== */

window.booth = {

    /* Camera */

    stream: null,
    cameraStarted: false,
    isCapturing: false,

    /* Strip */

    currentStrip: 1,
    requiredPhotos: 4,

    /* Photos */

    currentPhoto: 0,
    photos: [],

    /* Editing */

    selectedPhoto: null,

    /* Filter */

    selectedFilter: "none"

};

/* ==========================================
   CREATE EMPTY PHOTO
========================================== */

function createEmptyPhoto() {

    return null;

}

/* ==========================================
   RESET PHOTO ARRAY
========================================== */

function resetPhotos() {

    window.booth.photos = Array.from(

        { length: window.booth.requiredPhotos },

        createEmptyPhoto

    );

}

/* ==========================================
   RESET SESSION
========================================== */

function resetSession() {

    window.booth.currentPhoto = 0;

    window.booth.selectedPhoto = null;

    window.booth.isCapturing = false;

    resetPhotos();

    syncModules();

}

/* ==========================================
   SAVE PHOTO
========================================== */

function savePhoto(index, imageSrc) {

    window.booth.photos[index] = {

        src: imageSrc,

        filter: window.booth.selectedFilter,

        zoom: 1,

        xOffset: 0,

        yOffset: 0

    };

}

/* ==========================================
   CHANGE STRIP
========================================== */

function changeStripTemplate(strip, requiredPhotos) {

    if (

        strip === window.booth.currentStrip &&

        requiredPhotos === window.booth.requiredPhotos

    ) {

        return;

    }

    window.booth.currentStrip = strip;

    window.booth.requiredPhotos = requiredPhotos;

    resetSession();

}

/* ==========================================
   REFRESH ALL MODULES
========================================== */

function syncModules() {

    refreshStripCanvas?.();

    syncUI?.();

}

/* ==========================================
   INITIALIZE MODULES
========================================== */

function initializeModules() {

    initCamera?.();

    initFilter?.();

    initializeStripCanvas?.();

    initEditor?.();

    initUI?.();

}

/* ==========================================
   APPLICATION STARTUP
========================================== */

function initPhotobooth() {

    console.log("🚀 Initializing Photobooth...");

    initializeModules();

    resetPhotos();

    syncModules();

    console.log("✅ Photobooth Ready");

}

/* ==========================================
   EXPORTS
========================================== */

window.savePhoto = savePhoto;

window.resetSession = resetSession;

window.changeStripTemplate = changeStripTemplate;

window.syncModules = syncModules;

window.initPhotobooth = initPhotobooth;

/* ==========================================
   START APPLICATION
========================================== */

document.addEventListener(

    "DOMContentLoaded",

    initPhotobooth

);

console.log("✅ photobooth.js loaded");