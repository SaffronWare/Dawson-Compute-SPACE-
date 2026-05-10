// setting up variables
let next = document.getElementById('next');
let back = document.getElementById('back');
    // this stores all of the cards into a list
let cards = document.querySelectorAll('.scroll .card');

current = 0

function showCard(){
    //hide all cards
    for (let x = 0; x < cards.length; x++){ //simple for loop
        cards[x].style.display = "none";
    }
    //show card
    cards[current].style.display = "block"; 
}
showCard();

next.onclick = function(){
    current++;
    if(current >= cards.length){
        current = 0;
    }
    showCard();
}

back.onclick = function(){
    current--;
    if(current < 0){
        current = cards.length -1;
    }
    showCard();
}