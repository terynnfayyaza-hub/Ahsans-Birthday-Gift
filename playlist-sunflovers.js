const audio = document.getElementById("audio");
const songs = document.querySelectorAll(".song");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const playlistPlay = document.getElementById("playlistPlay");
const shuffleBtn = document.getElementById("shuffleBtn");
const playlistHeart = document.getElementById("playlistHeart");

let shuffleMode = false;
let likedPlaylist = false;

const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volume = document.getElementById("volume");

const songList = Array.from(songs);

let currentIndex = 0;
audio.volume = 1;

/* ==========================================
   UPDATE BOTH PLAY BUTTONS
========================================== */
function updatePlayButtons() {

    if (audio.paused) {

        playBtn.innerHTML =
            '<i class="fa-solid fa-play"></i>';

        playlistPlay.innerHTML =
            '<i class="fa-solid fa-play"></i>';

    } else {

        playBtn.innerHTML =
            '<i class="fa-solid fa-pause"></i>';

        playlistPlay.innerHTML =
            '<i class="fa-solid fa-pause"></i>';

    }

}

/* ==========================================
   STORE ORIGINAL NUMBERS
========================================== */
songList.forEach((song, i) => {
    const num = song.querySelector(".num");
    num.dataset.original = i + 1;
});

/* ==========================================
   RESET UI
========================================== */
function resetSongsUI() {
    songList.forEach((song) => {
        const num = song.querySelector(".num");
        num.textContent = num.dataset.original;
        song.classList.remove("active");
    });
}

/* ==========================================
   ACTIVE SONG UI
========================================== */
function setActiveSong(index) {
    resetSongsUI();

    const activeSong = songList[index];
    activeSong.classList.add("active");

    activeSong.querySelector(".num").textContent = "▶";
}

/* ==========================================
   LOAD SONG
========================================== */
function loadSong(index) {

    currentIndex = index;

    const song = songList[index];

    const songSrc = song.dataset.src;

    console.log("Loading:", songSrc);

    audio.src = songSrc;

    audio.play()
        .then(() => {

            updatePlayButtons();

            setActiveSong(index);

        })
        .catch(error => {

            console.error("Audio Error:", error);

        });
}

/* ==========================================
   CLICK SONG
========================================== */
songList.forEach((song, index) => {

    song.addEventListener("click", () => {

        loadSong(index);

    });

});

/* ==========================================
   PLAY / PAUSE BUTTON
========================================== */
playBtn.addEventListener("click", () => {

    if (!audio.src) {

        loadSong(currentIndex);
        return;

    }

    if (audio.paused) {

        audio.play();
        setActiveSong(currentIndex);

    } else {

        audio.pause();

    }

    updatePlayButtons();

});

/* ==========================================
   NEXT
========================================== */
nextBtn.addEventListener("click", () => {

    if (shuffleMode) {

        currentIndex =
            Math.floor(Math.random() * songList.length);

    } else {

        currentIndex++;

        if (currentIndex >= songList.length) {
            currentIndex = 0;
        }

    }

    loadSong(currentIndex);

});

/* ==========================================
   PREVIOUS
========================================== */
prevBtn.addEventListener("click", () => {

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = songList.length - 1;
    }

    loadSong(currentIndex);

});

/* ==========================================
   UPDATE PROGRESS
========================================== */

audio.addEventListener("timeupdate", () => {

    if (!audio.duration) return;

    progress.value = (audio.currentTime / audio.duration) * 100;

    currentTimeEl.textContent = formatTime(audio.currentTime);

    durationEl.textContent = formatTime(audio.duration);

});

/* ==========================================
   SEEK
========================================== */
progress.addEventListener("input", () => {

    if (!audio.duration) return;

    audio.currentTime =
        (progress.value / 100) * audio.duration;

});

/* ==========================================
   FORMAT TIME
========================================== */
function formatTime(seconds) {

    if (isNaN(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;

}

/* ==========================================
   SONG ENDED
========================================== */
audio.addEventListener("ended", () => {

    nextBtn.click();

});

/* ==========================================
   DEBUG
========================================== */
console.log("Playlist JS Loaded!");

/* ==========================================
   PLAYLIST PLAY BUTTON
========================================== */

playlistPlay.addEventListener("click", () => {

    if (!audio.src) {

        loadSong(0);
        return;

    }

    if (audio.paused) {

        audio.play();
        setActiveSong(currentIndex);

    } else {

        audio.pause();

    }

    updatePlayButtons();

});

/* ==========================================
   SHUFFLE BUTTON
========================================== */

shuffleBtn.addEventListener("click", () => {

    shuffleMode = !shuffleMode;

    shuffleBtn.style.color =
        shuffleMode ? "#1DB954" : "";

});

/* ==========================================
   HEART BUTTON
========================================== */

playlistHeart.addEventListener("click", () => {

    likedPlaylist = !likedPlaylist;

    playlistHeart.innerHTML = likedPlaylist
        ? `<i class="fa-solid fa-heart"></i>`
        : `<i class="fa-regular fa-heart"></i>`;

});

/* ==========================================
   VOLUME
========================================== */

const volumeIcon = document.querySelector(".volume-icon");

volume.addEventListener("input", () => {

    audio.volume = volume.value / 100;

    if (volume.value == 0) {

        volumeIcon.className = "fa-solid fa-volume-xmark volume-icon";

    } else if (volume.value < 50) {

        volumeIcon.className = "fa-solid fa-volume-low volume-icon";

    } else {

        volumeIcon.className = "fa-solid fa-volume-high volume-icon";

    }

});

/* ==========================================
   KEEP BOTH PLAY BUTTONS SYNCHRONIZED
========================================== */

audio.addEventListener("play", updatePlayButtons);

audio.addEventListener("pause", updatePlayButtons);