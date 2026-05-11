//set up variable
var deck = document.querySelectorAll(".card"); //list
var topIndex = 0;

var cardWidth = 393;
var distance = 0;
drag = 0;

var isDragging = false;
var startX = 0;

//updates cards
function update(){
    deck.forEach(function(card, index) {
        //finds the positino of each card in the stack and offsets it
        let position = (index - topIndex + deck.length) % deck.length;
        let offset = position * 8;

        //card follows cursor
        if (position ===0){
            offset += distance;
        }

    //stack the cards
    card.style.zIndex = deck.length - position;
        //puts the card in the center then shifts X according to offset
    card.style.transform = "translate(-50%, -50%) translateX(" +offset +"px)";
    });
}

//checks if card is being clicked and starts drag
window.addEventListener("pointerdown", function(event) {
    isDragging = true;
    startX = event.clientX;  //updates var to its position actuelle
});

//checks if the clicker is moving, drags the top card
window.addEventListener("pointermove", function(event) {
    if (!isDragging) {
        return;
    }
    distance = event.clientX - startX;
    update(); //displays accordingly
});

//stop drag if pointer unclicked
window.addEventListener("pointerup", function(){
    if (!isDragging) {return;}

    isDragging = false;
    var done_swipe = 100; //sets the swipe threshold to 100px
    var card = deck[topIndex];

    // checks if the user has swiped fully left or right
    if (distance < -done_swipe) {
        //adding annimation from CSS
        card.classList.add("swipeLeft");

        card.addEventListener("animationend", function(){
            card.classList.remove("swipeLeft");

            topIndex +=1;
            if (topIndex >= deck.length) {topIndex = 0;}
        
            distance = 0;
            update();
        }, {once: true}); //executes once animationend == true
    } 
    else if (distance > done_swipe) {
        card.classList.add("swipeRight");

        card.addEventListener("animationend", function(){
            card.classList.remove("swipeRight");

            topIndex -=1;
            if (topIndex < 0){topIndex = deck.length -1;}

            distance = 0;
            update();
        }, {once: true});  //executes once animationend == true
    }
    else {    //snap back
        distance = 0;
        update();
    }
});

update();
