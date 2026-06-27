/* =========================================================
   PHOTOBOOTH UI MODULE
   Handles User Interface Only
========================================================= */

/* ==========================================
   DOM REFERENCES
========================================== */

let takePhotoBtn = null;
let downloadStripBtn = null;
let filterSelect = null;
let stripOptions = [];

/* ==========================================
   INITIALIZE
========================================== */

function initUI() {

    console.log("🖥️ Initializing UI...");

    cacheUI();

    bindEvents();

    syncUI();

}

/* ==========================================
   CACHE DOM
========================================== */

function cacheUI() {

    takePhotoBtn = document.getElementById("takePhoto");

    downloadStripBtn = document.getElementById("downloadStrip");

    filterSelect = document.getElementById("filterSelect");

    stripOptions = document.querySelectorAll(".strip-option");

}

/* ==========================================
   EVENT BINDING
========================================== */

function bindEvents() {

    /* Take Photo */

    takePhotoBtn?.addEventListener(

        "click",

        onTakePhoto

    );

    /* Download */

    downloadStripBtn?.addEventListener(

        "click",

        onDownload

    );

    /* Filter */

    filterSelect?.addEventListener(

        "change",

        onFilterChange

    );

    /* Strip */

    stripOptions.forEach(option => {

        option.addEventListener(

            "click",

            () => onStripSelected(option)

        );

    });

}

/* ==========================================
   TAKE PHOTO BUTTON
========================================== */
async function onTakePhoto() {

    // ALWAYS unlock FIRST AND WAIT FULLY
    await audio.unlock();

    audio.playClick();

    // small delay fixes browser gesture race condition
    await new Promise(r => setTimeout(r, 50));

    if (!booth.cameraStarted) {
        const started = await startCamera();

        if (started) syncModules();

        return;
    }

    if (booth.isCapturing) return;

    beginCapture();
}

/* ==========================================
   DOWNLOAD
========================================== */

async function onDownload() {

    if (typeof downloadStrip !== "function") {

        return;

    }

    await downloadStrip();

}

/* ==========================================
   FILTER
========================================== */

function onFilterChange() {

    if (typeof changeFilter !== "function") {

        return;

    }

    changeFilter(

        filterSelect.value

    );

}

/* ==========================================
   STRIP
========================================== */

function onStripSelected(option) {

    stripOptions.forEach(button => {

        button.classList.remove(

            "active"

        );

    });

    option.classList.add(

        "active"

    );

    changeStripTemplate(

        Number(option.dataset.strip),

        Number(option.dataset.photos)

    );

}

/* ==========================================
   TAKE PHOTO BUTTON
========================================== */

function updateTakePhotoButton() {

    if (!takePhotoBtn) return;

    /* Camera Off */

    if (!booth.cameraStarted) {

        takePhotoBtn.innerHTML =

            `<i class="fa-solid fa-camera"></i> Start Camera`;

        takePhotoBtn.disabled = false;

        return;

    }

    /* Capturing */

    if (booth.isCapturing) {

        takePhotoBtn.innerHTML =

            `<i class="fa-solid fa-camera"></i> Capturing...`;

        takePhotoBtn.disabled = true;

        return;

    }

    /* Ready */

    takePhotoBtn.innerHTML =

        `<i class="fa-solid fa-camera"></i> Take Photos`;

    takePhotoBtn.disabled = false;

}

/* ==========================================
   DOWNLOAD BUTTON
========================================== */

function updateDownloadButton() {

    if (!downloadStripBtn) return;

    if (typeof allPhotosCaptured !== "function") {

        downloadStripBtn.disabled = true;

        return;

    }

    downloadStripBtn.disabled =

        !allPhotosCaptured();

}

/* ==========================================
   FILTER
========================================== */

function updateFilter() {

    if (!filterSelect) return;

    filterSelect.value =

        booth.selectedFilter;

}

/* ==========================================
   UI SYNC
========================================== */

function syncUI() {

    updateTakePhotoButton();

    updateDownloadButton();

    updateFilter();

}

/* ==========================================
   EXPORTS
========================================== */

window.initUI = initUI;

window.syncUI = syncUI;

console.log("🖥️ photobooth-ui.js loaded");