//set up variable
var deck = document.querySelectorAll(".card"); //list
var topIndex = 0;

var cardWidth = 393;
var distance = 0;
var direction = 1;

var isDragging = false;
var startX = 0;

//updates cards
function update(){
    deck.forEach(function(card, index) {
        let position;
        //finds the positino of each card in the stack and offsets it
        if (direction === 1) {position = (index - topIndex + deck.length) % deck.length;}
        else {position = (topIndex - index + deck.length) % deck.length;}
        let offset = position * 8;

        //card follows cursor
        if (position ===0){offset += distance;}

    //stack the cards
    card.style.zIndex = deck.length - position;
        //puts the card in the center then shifts X according to offset
    card.style.transform = "translate(-50%, -50%) translateX(" +offset +"px)";
    });
}

//checks if card is being clicked and starts drag
window.addEventListener("pointerdown", function(event) {
    isDragging = true;
    var card = deck[topIndex];
    card.classList.add("dragging");
    startX = event.clientX;  //updates var to its position actuelle
});

//checks if the clicker is moving, drags the top card
window.addEventListener("pointermove", function(event) {
    if (!isDragging) {return;}
    distance = event.clientX - startX;

    //check direction
    if (distance>0){direction = -1;}
    else {direction = 1;}
    update(); //displays accordingly
});

//stop drag if pointer unclicked
window.addEventListener("pointerup", function(){
    if (!isDragging) {return;}

    isDragging = false;
    var done_swipe = 100; //sets the swipe threshold to 100px
    var card = deck[topIndex];
    card.classList.remove("dragging");

    // checks if the user has swiped fully left or right
    if (distance < -done_swipe) {
        //replacing animation
        card.style.transform = "translate(-50%, -50%) translateX(-120vw)";
        card.style.opacity = "0";

        setTimeout(function(){
            //reset
            card.style.transform = "translate(-50%, -50%)";
            card.style.opacity = "1";
            

            topIndex +=1;
            if (topIndex >= deck.length) {topIndex = 0;}
        
            distance = 0;
            update();

        }, 500); //waits 500 ms
    } 
    else if (distance > done_swipe) {
        card.style.transform = "translate(-50%, -50%) translateX(120vw)";
        card.style.opacity = "0";

        setTimeout(function(){
            //reset
            card.style.transform = "translate(-50%, -50%)";
            card.style.opacity = "1";

            topIndex -=1;
            if (topIndex < 0){topIndex = deck.length -1;}

            distance = 0;
            update();
        }, 500); 
    }
    else {    //snap back
        distance = 0;
        update();
    }
});

update();
