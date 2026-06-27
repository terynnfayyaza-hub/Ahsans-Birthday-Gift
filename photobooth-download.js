/* =========================================================
   PHOTOBOOTH DOWNLOAD MODULE
========================================================= */

/* ==========================================
   DOWNLOAD STRIP
========================================== */

async function downloadStrip(filename = null) {

    try {

        if (!stripCanvas) {

            console.error("❌ Strip canvas not found.");

            return;

        }

        if (!hasAnyPhoto()) {

            alert("Please take at least one photo first.");

            return;

        }

        // Always redraw before exporting

        if (typeof refreshStripCanvas === "function") {

            refreshStripCanvas();

        }

        const dataURL = exportStripImage();
            if (!dataURL) {
                return;
            }

        const link = document.createElement("a");

        link.href = dataURL;

        link.download =

            filename ||

            generateFilename();

        document.body.appendChild(link);

        link.click();
        link.remove();

    }

    catch (err) {

        console.error(

            "Download failed:",

            err

        );

    }

}

/* ==========================================
   CHECK IF THERE ARE PHOTOS
========================================== */

function hasAnyPhoto() {
    return booth.photos.some(
    photo => photo && photo.src
    );
}

/* ==========================================
   GENERATE FILE NAME
========================================== */

function generateFilename() {

    const now = new Date();

    const pad = value =>

        String(value).padStart(2, "0");

    return (
    `luma-photobooth-strip-` +
    `${booth.currentStrip}-` +
    `${now.getFullYear()}-` +
    `${pad(now.getMonth()+1)}-` +
    `${pad(now.getDate())}_` +
    `${pad(now.getHours())}-` +
    `${pad(now.getMinutes())}-` +
    `${pad(now.getSeconds())}.png`
    );
}

/* ==========================================
   EXPORT DATA URL
========================================== */

function exportStripImage() {

    if (!stripCanvas) {
        return null;
    }

    return stripCanvas.toDataURL("image/png", 1);

}

window.exportStripImage = exportStripImage;

console.log("✅ photobooth-download.js loaded");