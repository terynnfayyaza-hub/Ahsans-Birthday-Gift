/* =========================================================
   PHOTOBOOTH FILTER MODULE
========================================================= */
/* ==========================================
   FILTER DEFINITIONS
========================================== */

const FILTERS = {

    none: {
        name: "Normal",
        css: "none"
    },

    vintage: {
        name: "Vintage",
        css: "sepia(0.55) contrast(1.15) brightness(1.05) saturate(0.9)"
    },

    bw: {
        name: "Black & White",
        css: "grayscale(1) contrast(1.15)"
    },

    warm: {
        name: "Warm",
        css: "sepia(0.25) saturate(1.35) brightness(1.08) hue-rotate(-8deg)"
    },

    film: {
        name: "Film",
        css: "contrast(1.2) saturate(0.9) brightness(0.98) sepia(0.15)"
    },

    dream: {
        name: "Dreamy",
        css: "brightness(1.15) contrast(0.9) saturate(1.2)"
    },

    sepia: {
        name: "Sepia",
        css: "sepia(1)"
    }

};

/* ==========================================
   INITIALIZE
========================================== */
function initFilter() {

    console.log("🎨 Filter module initialized");

    if (!window.booth.selectedFilter) {
        window.booth.selectedFilter = "none";
    }

    const camera = document.getElementById("camera");

    if (camera) {
        camera.style.filter = getCurrentFilter().css;
    }
}

window.initFilter = initFilter;

/* ==========================================
   CHANGE FILTER
========================================== */
function changeFilter(filterName) {

    if (!FILTERS[filterName]) {

        console.warn("Unknown filter:", filterName);
        filterName = "none";

    }

    window.booth.selectedFilter = filterName;

    console.log("🎨 Filter:", filterName);

    // Apply filter to LIVE CAMERA
    const camera = document.getElementById("camera");

    if (camera) {
        camera.style.filter = FILTERS[filterName].css;
    }

    // Refresh strip preview
    if (typeof refreshStripCanvas === "function") {
        refreshStripCanvas();
    }
}

window.changeFilter = changeFilter;

/* ==========================================
   GET FILTER
========================================== */

function getCurrentFilter() {

    return FILTERS[window.booth.selectedFilter] || FILTERS.none;

}

window.getCurrentFilter = getCurrentFilter;

/* ==========================================
   APPLY FILTER TO CANVAS
========================================== */

function applyCanvasFilter(ctx, filterName) {

    const filter = FILTERS[filterName] || FILTERS.none;

    ctx.filter = filter.css;

}

window.applyCanvasFilter = applyCanvasFilter;

/* ==========================================
   FILTER UTILITIES
========================================== */

function getAvailableFilters() {

    return Object.keys(FILTERS);

}

window.getAvailableFilters = getAvailableFilters;

/* ==========================================
   EXPORT
========================================== */

window.FILTERS = FILTERS;

console.log("🎨 photobooth-filter.js loaded");