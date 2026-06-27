/* =========================================================
   PHOTOBOOTH AUDIO MODULE
========================================================= */

/* ==========================================
   AUDIO FILES
========================================== */

const sounds = {
    click: new Audio("assets/click.mp3"),
    countdown: new Audio("assets/countdown.mp3"),
    shutter: new Audio("assets/shutter.mp3")
};

/* ==========================================
   PRELOAD
========================================== */
Object.values(sounds).forEach(sound => {
    sound.preload = "auto";
});

/* ==========================================
   AUDIO MANAGER
========================================== */
const audio = {
    unlocked: false,

    async unlock() {
        if (this.unlocked) return;
        this.unlocked = true;
        const unlockSound = async (sound) => {
            try {
                sound.currentTime = 0;
                await sound.play();
                sound.pause();
                sound.currentTime = 0;
            }

            catch (err) {
                console.warn("Audio unlock blocked:", err);
            }
        };

        await Promise.all(
            Object.values(sounds).map(unlockSound)
        );

        console.log("🔊 Audio unlocked");
    },

    play(soundName) {
        const sound = sounds[soundName];
        if (!sound) return;
        sound.pause();
        sound.currentTime = 0;
        sound.play().catch(() => {});
    },

    playClick() {
        this.play("click");
    },

    playCountdown() {
        this.play("countdown");
    },

    playShutter() {
        this.play("shutter");
    }

};

/* ==========================================
   EXPORT
========================================== */

window.audio = audio;

console.log("🔊 photobooth-audio.js loaded");