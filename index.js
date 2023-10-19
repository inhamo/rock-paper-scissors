//Elements
const playerGestures = document.querySelectorAll('.paper, .rock, .scissors');
const resultText = document.querySelector('.result');
const triangleElement = document.querySelectorAll('.triangle-js');
const waitingGesture = document.querySelector('.waiting-choice');
const btnPlayAgain = document.querySelector('.btn-play-again');
const housePickText = document.querySelector('.house-pick-text');
const playerText = document.querySelector('.your-pick-text');

// Game State
let playerGesture = undefined;
let houseGesture = undefined;
let score = 0;

//Constant for class names
const GESTURES = ['rock', 'paper', 'scissors'];

window.addEventListener('load', ()=> {
    score = parseInt(localStorage.getItem('score') || 0);
    updateScore(score);
});

playerGestures.forEach( (gesture) => {
    gesture.addEventListener('click', (event)=> {
        event.preventDefault();
        const className = gesture.classList;      
        playerGesture = getPickedGesture(className);
        hideUnselectedItems();
        showSelectedItem();
        showPickText();
        setTimeout( ()=>{
            randomPick();
            showResults();
        }, 3000);
    });   
});

function hideUnselectedItems(){
    playerGestures.forEach( (gesture) => {
        if(!gesture.classList.contains(playerGesture)){
            gesture.classList.add('none');
        }
    });

    triangleElement.forEach((triangle)=>triangle.classList.add('none'));
    waitingGesture.classList.remove('none');
}


function showSelectedItem(){
    playerGestures.forEach( (gesture)=> {
         if(gesture.classList.contains(playerGesture)) gesture.classList.add('player-pick');
    });
}

function showResults(){
    gameDecider();
    movePlayerAndHousePicks();

    setTimeout( ()=> {
        showResultText();
    }, 1000);
}

function showResultText(){
    resultText.classList.remove('none');
    btnPlayAgain.classList.remove('none');
}

function showPickText(){
    housePickText.classList.remove('none');
    playerText.classList.remove('none');
}

function getPickedGesture(classList){
    if(classList && classList.contains('rock') ) return 'rock';
    if(classList && classList.contains('paper') ) return 'paper';
    if(classList && classList.contains('scissors') ) return 'scissors';
}

function randomPick(){
    const randomNumber = Math.floor(Math.random() * 3);
    houseGesturePick(randomNumber);
}

function houseGesturePick(randomNumber){
    houseGesture = GESTURES[randomNumber];
    showHouseGesture();
}

function showHouseGesture(){
    waitingGesture.classList.add('none');
    playerGestures.forEach((gesture) => {
        if(gesture.classList.contains(houseGesture)){            
            if(gesture.classList.contains(playerGesture)){
                const mainContainer = document.querySelector('.main-content');
                gesture.classList.remove('none');

                const clonedGesture = gesture.cloneNode(true);
                mainContainer.appendChild(clonedGesture);

                if(isDesktopSize()){
                    clonedGesture.style.left = '70%';
                    clonedGesture.style.width = '150px';
                    clonedGesture.style.height = '150px';
                }

                btnPlayAgain.addEventListener('click', ()=> {
                    if(clonedGesture){
                        mainContainer.removeChild(clonedGesture);
                    }
                });

                clonedGesture.classList.add('house-pick');
            } else {
                gesture.classList.remove('none');
                gesture.classList.add('house-pick');
            }
        }
    });
}

function gameDecider() {
    const outcomes = {
      rock: { rock: 'Draw', paper: 'You Lose', scissors: 'You Win' },
      paper: { rock: 'You Win', paper: 'Draw', scissors: 'You Lose' },
      scissors: { rock: 'You Lose', paper: 'You Win', scissors: 'Draw' }
    };
  
    resultText.innerText = outcomes[playerGesture][houseGesture];

    if(resultText.innerText === 'You Win') {
        addScore(1);
        playerGestures.forEach((gesture)=> {
            if(gesture.classList.contains('player-pick')){
                gesture.classList.add('winner');
            }
        })
    }

    if(resultText.innerText === 'You Lose') {
        playerGestures.forEach((gesture)=> {
            if(gesture.classList.contains('house-pick')){
                gesture.classList.add('winner');
            }
        })
    }
}

function addScore(scoreUpdate){
    score += scoreUpdate;
    localStorage.setItem('score', score);
    updateScore(score);
}

function updateScore(score){
    const scoreDisplay = document.querySelector('.score-num');
    scoreDisplay.innerText = score;
}
  
function isDesktopSize(){
    return window.matchMedia("(min-width: 768px)").matches;
}

function movePlayerAndHousePicks(){
    if(isDesktopSize()){
        playerGestures.forEach((gesture)=> {
            if(playerGesture != houseGesture){
                if(gesture.classList.contains('house-pick')){
                    gesture.style.left = '70%';
                    gesture.style.width = '150px';
                    gesture.style.height= '150px';
                }
            }

            if (gesture.classList.contains('player-pick')) {
                gesture.style.left = '0%';
                gesture.style.width = '150px';
                gesture.style.height= '150px';
            }
        });

        housePickText.style.left= '72%';
        housePickText.style.fontSize = '12px';
        playerText.style.left = '5%';
        playerText.style.fontSize = '12px';
    }
}

btnPlayAgain.addEventListener('click', ()=> {
    window.location.reload();
});

function showAndHideRules(){
    const rulesPages = document.querySelector('.rules-page');
    rulesPages.classList.contains('none') ? rulesPages.classList.remove('none'): rulesPages.classList.add('none');
}

document.querySelector('.btn-rules').addEventListener('click',showAndHideRules);
document.querySelector('.close').addEventListener('click', showAndHideRules);