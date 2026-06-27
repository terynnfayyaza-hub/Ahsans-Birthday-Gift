// Elements
const envelope = document.getElementById("envelope-container");
const letter = document.getElementById("letter-container");
const noBtn = document.querySelector(".no-btn");
const yesBtn = document.querySelector(".yes-btn");

const title = document.getElementById("letter-title");
const huskyImg = document.getElementById("letter-husky");
const buttons = document.getElementById("letter-buttons");
const finalText = document.getElementById("final-text");

// Click Envelope

envelope.addEventListener("click", () => {
    envelope.style.display = "none";
    letter.style.display = "flex";

    setTimeout( () => {
        document.querySelector(".letter-window").classList.add("open");
    },50);
});

// Logic to move the NO btn

noBtn.addEventListener("mouseover", () => {
    const min = 200;
    const max = 200;

    const distance = Math.random() * (max - min) + min;
    const angle = Math.random() * Math.PI * 2;

    const moveX = Math.cos(angle) * distance;
    const moveY = Math.sin(angle) * distance;

    noBtn.style.transition = "transform 0.3s ease";
    noBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
});

let yesClicks = 0;
let yesScale = 1;

const screen1 = document.getElementById("screen1");
const screen2 = document.getElementById("screen2");
const screen3 = document.getElementById("screen3");
const screen4 = document.getElementById("screen4");

yesBtn.addEventListener("click", () => {

    yesClicks++;

    if (yesClicks < 4) {

        yesScale += 1;

        yesBtn.style.transform =
            `scale(${yesScale})`;

        return;
    }

    screen1.style.display = "none";
    screen2.style.display = "flex";

});

// Screen 2 -> 3
document
.getElementById("toDateBtn")
.addEventListener("click", () => {

    screen2.style.display = "none";
    screen3.style.display = "flex";

});

// Screen 3 -> 4
document
.getElementById("toFinalBtn")
.addEventListener("click", () => {

    const selectedDate =
        document.getElementById("datePicker").value;

    const selectedTime =
        document.getElementById("timePicker").value;

    if(!selectedDate || !selectedTime){

        alert(
            "Pick a date and time first sayangg ❤️"
        );

        return;
    }

    document
    .getElementById("toDateBtn")
    .addEventListener("click", () => {

        screen2.style.display = "none";
        screen3.style.display = "flex";

        flatpickr("#datePicker", {
            inline:true,
            minDate:"today"
        });

    });
    screen3.style.display = "none";
    screen4.style.display = "flex";

    const dateObj = new Date(selectedDate);

    const formattedDate =
        dateObj.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric"
            }
        );

    document.getElementById(
        "selected-date-display"
    ).innerHTML = `
        ${formattedDate}
        <br>
        at ${selectedTime}
    `;

});

window.addEventListener("DOMContentLoaded", () => {

    flatpickr("#datePicker", {
        inline: true,
        minDate: "today"
    });

});

// Screen 4
document
    .getElementById("homeBtn")
    .addEventListener("click", () => {

        window.location.href =
            "birthday.html";

    });

document
.getElementById("calendarBtn")
.addEventListener("click", () => {

    const selectedDate =
        document.getElementById("datePicker").value;

    const selectedTime =
        document.getElementById("timePicker").value;

    const [hourString] =
        selectedTime.split(":");

    let hour =
        parseInt(hourString);

    if(selectedTime.includes("PM")
       && hour !== 12){
        hour += 12;
    }

    const start =
        new Date(selectedDate);

    start.setHours(hour);
    start.setMinutes(0);

    const end =
        new Date(start);

    end.setHours(
        start.getHours() + 2
    );

    const formatICS = date =>
        date.toISOString()
            .replace(/[-:]/g,"")
            .split(".")[0] + "Z";

    const ics = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Our Date ❤️
DTSTART:${formatICS(start)}
DTEND:${formatICS(end)}
DESCRIPTION:Can't wait hihi
END:VEVENT
END:VCALENDAR
`;

    const blob =
        new Blob(
            [ics],
            {type:"text/calendar"}
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;
    a.download = "our-date.ics";

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);

});