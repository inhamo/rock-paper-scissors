const playerOptions = document.querySelectorAll('[data-choice]');
const playAgainBtn = document.querySelector('.btn-play-again');
const rulesBtn = document.querySelector('.btn-rules');
const closeBtn = document.querySelector('.close');
const resultText = document.querySelector('.result');

/* Get the name of the clicked choice*/
let playerChoice = '';
let houseChoice = '';
let score= 0;

// Load the score from localStorage on page load
window.addEventListener('load', () => {
    score = parseInt(localStorage.getItem('score') || '0', 10);
    updateScoreDisplay();
    showRules();
});

function showRules(){
    const displayRules = document.querySelector('.rules-page');
    const isNone = displayRules.style.display === 'none';

    isNone ? displayRules.style.display = ' grid' : displayRules.style.display = 'none';
}

rulesBtn.addEventListener('click', showRules);
closeBtn.addEventListener('click', showRules);

playerOptions.forEach( (option) => {
    option.addEventListener('click', (event) => {
        event.preventDefault();

        playerChoice = event.target.dataset.choice;
        hideUnselectedElements();
        selectedElement();
        showGuideText();
        randomisingHouseChoice();
    });
});

function hideUnselectedElements(){
    playerOptions.forEach( (option) => {
        if(!option.classList.contains(`${playerChoice}`)){
            option.classList.add('none');
        };
    });

    document.querySelector('.small-triangle').classList.add('none');
    document.querySelector('.big-triangle').classList.add('none');
};

function putShadowOnPlayerWinner(){
    playerOptions.forEach( (option) => {
        if(option.classList.contains('player-pick')){
            option.classList.add('winner');
        };
    });
};

function putShadowOnHouseWinner(){
    playerOptions.forEach( (option) => {
        if(option.classList.contains('house-pick')){
            option.classList.add('winner');
        };
    });
};

function removeShadowOnPlayerWinner(){
    playerOptions.forEach( (option) => {
        if(option.classList.contains('player-pick')){
            option.classList.remove('winner');
        };
    });
};

function removeShadowOnHouseWinner(){
    playerOptions.forEach( (option) => {
        if(option.classList.contains('house-pick')){
            option.classList.remove('winner');
        };
    });
};

function selectedElement() {
    playerOptions.forEach( (option) => {
        if(option.classList.contains(`${playerChoice}`)){
            option.classList.add('player-pick');
        };
    });
};

function showGuideText() {
    document.querySelector('.your-pick-text').classList.remove('none');
    document.querySelector('.house-pick-text').classList.remove('none');
    document.querySelector('.waiting-choice').classList.remove('none');
}

function hideGuideText(){
    document.querySelector('.your-pick-text').classList.add('none');
    document.querySelector('.house-pick-text').classList.add('none');
    document.querySelector('.waiting-choice').classList.add('none');
}

function randomisingHouseChoice(){
    const randomNumber = Math.random().toFixed(2);

    /* 
    rock = 0-0.33
    paper = 0.34 - 0.66
    scissors = 0.67 - 1
    */

    if(randomNumber <= 0.33){
        houseChoice = 'rock';
    } else if( randomNumber > 0.33 && randomNumber <= 0.66) {
        houseChoice = 'scissors';
    } else if(randomNumber > 0.66) {
        houseChoice = 'paper';
    };

    setTimeout( () => {
        showHouseChoice();
        setTimeout( ()=> {
            gameDecider();
        }, 1000);
    }, 3000);
};

function showHouseChoice(){
    document.querySelector('.waiting-choice').classList.add('none');

    playerOptions.forEach((option) => {
            if(option.classList.contains(houseChoice)){
                if(option.classList.contains('none')){
                    option.classList.remove('none');
                    option.classList.add('house-pick');
                } else {
                    option.classList.add('house-pick');
                };
            };
    });
};

function isDesktopSize() {
    return window.matchMedia("(min-width: 768px)").matches;
}

function movePlayerAndHousePicks() {
    if (isDesktopSize()) {
        playerOptions.forEach((option) => {
            if (option.classList.contains('house-pick')) {
                option.style.left = '60%';
                document.querySelector('.house-pick-text').style.right = '29%';
            }
            if (option.classList.contains('player-pick')) {
                option.style.left = '25%';
                document.querySelector('.your-pick-text').style.left = '29%';
            }
        });
    }
}

function gameDecider() {    
    playAgainBtn.classList.remove('none');
    resultText.classList.remove('none');

    movePlayerAndHousePicks();

    if(playerChoice === 'rock'){
        switch(houseChoice){
            case 'rock':
                resultText.innerText = 'Draw';
                break;
            case 'paper':
                resultText.innerText = 'You Lose';
                playAgainBtn.style.color = 'red';
                putShadowOnHouseWinner();
                break;
            case 'scissors':
                resultText.innerText = 'You Win';
                putShadowOnPlayerWinner();
                addScore(1);
                break;
        }
    }else if(playerChoice === 'paper'){
        switch(houseChoice){
            case 'rock':
                resultText.innerText = 'You Win';
                putShadowOnPlayerWinner();
                addScore(1);
                break;
            case 'paper':
                resultText.innerText = 'Draw';
                break;
            case 'scissors':
                resultText.innerText = 'You Lose';
                playAgainBtn.style.color = 'red';
                putShadowOnHouseWinner();
                break;
        }
    }else if(playerChoice === 'scissors'){
        switch(houseChoice){
            case 'rock':
                resultText.innerText = 'You Lose';
                playAgainBtn.style.color = 'red';
                putShadowOnHouseWinner();
                break;
            case 'paper':
                resultText.innerText = 'You Win';
                putShadowOnPlayerWinner();
                addScore(1);
                break;
            case 'scissors':
                resultText.innerText = 'Draw';
                break;
        }
    };
};

function playAgain(){
    playerOptions.forEach( (option) => {
        option.classList.remove('none');
        if(option.classList.contains('house-pick')){
            removeShadowOnHouseWinner();
            option.classList.remove('house-pick');
        }

        if(option.classList.contains('player-pick')){
            removeShadowOnPlayerWinner();
            option.classList.remove('player-pick');
        }
    });

    document.querySelector('.result').classList.add('none');
    document.querySelector('.big-triangle').classList.remove('none');
    document.querySelector('.small-triangle').classList.remove('none');
    playAgainBtn.classList.add('none');

    hideGuideText();    
};

function addScore(scoreChange) {
    score += scoreChange;
    localStorage.setItem('score', score);
    updateScoreDisplay();
};

function updateScoreDisplay(){
    const scoreElement = document.querySelector('.score-num');
    scoreElement.innerText = score;   
};

playAgainBtn.addEventListener('click', playAgain);