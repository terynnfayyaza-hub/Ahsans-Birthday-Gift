
const cards = document.querySelectorAll(".photo-card");
const overlay = document.querySelector(".overlay");
let popup=null;
let original=null;

cards.forEach(card=>{
    card.addEventListener("click",(e)=>{
        e.stopPropagation();
        if(popup) return;
        original=card;
        
        const rect=
            card.getBoundingClientRect();
        
            popup=
            card.cloneNode(true);
        
            popup.classList.add(
            "popup-card"
        );

        popup.style.top = "50%";
        popup.style.left = "50%";
        popup.style.width = "550px";
        popup.style.height = "550px";
        popup.style.transform = "translate(-50%,-50%) scale(.8)";
        popup.style.opacity = 0;

    document.body.appendChild(
        popup
    );

    overlay.classList.add(
        "show"
    );

    requestAnimationFrame(()=>{
        popup.style.transform = "translate(-50%,-50%) scale(1)";
        popup.style.opacity = 1;
    });

    popup.addEventListener(
        "click",
            e=>{
                e.stopPropagation();
                popup.classList.toggle(
                    "active"
                );
            }
    );

    });

});

overlay.addEventListener(
    "click", ()=>{
        if(!popup) return;
        popup.style.transform = "translate(-50%,-50%) scale(.8)";
        popup.style.opacity = 0;

    overlay.classList.remove(
        "show"
    );

    setTimeout(()=>{
        popup.remove();
        popup = null;
        original = null;
    }, 650);
    }
);
