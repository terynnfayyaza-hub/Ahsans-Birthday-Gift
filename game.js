const cards = {

common: [],
rare: [],
epic: [],
legendary: []

};

// COMMON (25)
for(let i=1;i<=25;i++){
cards.common.push(`cards/common/common${i}.png`);
}

// RARE (8)
for(let i=1;i<=8;i++){
cards.rare.push(`cards/rare/rare${i}.png`);
}

// EPIC (15)
for(let i=1;i<=15;i++){
cards.epic.push(`cards/epic/epic${i}.png`);
}

// LEGENDARY (2)
for(let i=1;i<=2;i++){
cards.legendary.push(`cards/legendary/legendary${i}.png`);
}

const owned = new Set(
    JSON.parse(
        localStorage.getItem("ownedCards")
    ) || []
);

function createCollection(){
    createGrid(
        "common-grid",
        cards.common
    );

    createGrid(
        "rare-grid",
        cards.rare
    );

    createGrid(
        "epic-grid",
        cards.epic
    );

    createGrid(
        "legendary-grid",
        cards.legendary
    );
}

function createGrid(id,array){
    const grid =
        document.getElementById(id);
        array.forEach(card=>{

    const div =
        document.createElement("div");
        div.className =
        "collection-card";

    const img =
        document.createElement("img");
        img.src =
        "cards/cover.png";
        img.dataset.card =
        card;

    div.appendChild(img);
    div.addEventListener("click", () => {

        if(img.src.includes("cover.png"))
            return;

        showPopup(img.dataset.card);

    });

    grid.appendChild(div);

    });
}

createCollection();

owned.forEach(card => {

    document
    .querySelectorAll(".collection-card img")
    .forEach(img => {

        if(img.dataset.card === card){

            img.src = card;

        }

    });

});

function getRandomCard(){

    const rarityRoll = Math.random();

    if(rarityRoll < 0.75){

        return cards.common[
            Math.floor(Math.random() * cards.common.length)
        ];

    }

    if(rarityRoll < 0.93){

        return cards.rare[
            Math.floor(Math.random() * cards.rare.length)
        ];

    }

    if(rarityRoll < 0.99){

        return cards.epic[
            Math.floor(Math.random() * cards.epic.length)
        ];

    }

    return cards.legendary[
        Math.floor(Math.random() * cards.legendary.length)
    ];

}

document
    .getElementById("drawBtn")
    .addEventListener("click", draw);

function draw(){

    const c1 = getRandomCard();
    const c2 = getRandomCard();
    const c3 = getRandomCard();

    draw1.src = c1;
    draw2.src = c2;
    draw3.src = c3;

    // 33% chance to win a card
    if(Math.random() < 0.33){

        const winningCard = getRandomCard();

        unlockCard(winningCard);
        showPopup(winningCard);

    }

}

function unlockCard(card){

    if(owned.has(card))
        return;

    owned.add(card);

    saveCollection();

    launchConfetti();

    document
    .querySelectorAll(".collection-card img")
    .forEach(img=>{

        if(img.dataset.card === card){

            img.src = card;
            img.classList.add("new-card");

        }

    });

}

function showPopup(card){
    const popup =
        document.getElementById("popup");

    const popupCard =
        document.getElementById("popupCard");

    popup.style.display = "flex";

    popupCard.src = card;
}

function closePopup(){

    document
    .getElementById("popup")
    .style.display =
    "none";

}

document
.getElementById("popup")
.addEventListener("click", closePopup);

function saveCollection(){

    localStorage.setItem(
        "ownedCards",
        JSON.stringify([...owned])
    );

}

/* CONFETTI */
function launchConfetti(){

    const end = Date.now() + 2000;

    (function frame(){

        confetti({
            particleCount: 4,
            angle: 60,
            spread: 60,
            origin: {
                x: 0,
                y: 0.7
            },
            zIndex: 10000
        });

        confetti({
            particleCount: 4,
            angle: 120,
            spread: 60,
            origin: {
                x: 1,
                y: 0.7
            },
            zIndex: 10000
        });

        if(Date.now() < end){
            requestAnimationFrame(frame);
        }

    })();

}