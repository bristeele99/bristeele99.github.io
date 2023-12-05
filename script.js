class Skater {
    constructor (skill) {
        // this.confidence = confidence 
        this.skill = skill || Math.floor(Math.random()*10)
        this.letters = "";
    }
    log(message) {
      const newMessage = document.createElement('p');
      newMessage.textContent = message;

      logContainer.appendChild(newMessage, logContainer.firstChild);

    }

}

const tonyHawk = new Skater (5);
const estroJen = new Skater (6);
const opponent = new Skater (5);

const paragraph = document.createElement('p');
const startButton = document.getElementById('start')
const button1 = document.getElementById('player1');
const button2 = document.getElementById('player2');
const button3 = document.getElementById('trick-Button');
const restartButton = document.getElementById('restart');
const logContainer = document.getElementById('logContainer');
const statusParagraph = document.getElementById('playerStatus');
const statusParagraph1 = document.getElementById('opponentStatus');

let loseState = false;
let oLoseState = false;
let gameStarted = false; 
let keysToCheck = [];

//////////////////////////////////////////////////
/////////////////////BUTTONS//////////////////////
//////////////////////////////////////////////////

function toggleButtons(...buttonIds) {
  // Loop through all provided button IDs
  buttonIds.forEach(buttonId => {
      const button = document.getElementById(buttonId);

      // Toggle visibility of buttons using CSS classes
      if (button) {
          button.classList.toggle('hidden');
      }
  });
}
// Attach click event listeners to start and restart to toggle buttons to start game or restart game.
startButton.addEventListener('click', () => 
toggleButtons('player1', 'player2', 'restart', 'start')
);

restartButton.addEventListener('click', () => {
  restartWindow();
});

//toggle for choosing player at the start
button1.addEventListener('click', () => { 
  toggleButtons ('player1', 'player2', 'trick-Button',
  'Trick-List', 'opponentStatus','playerStatus')
  gameStarted = true
});
button2.addEventListener('click', () => {
  toggleButtons ('player1', 'player2', 'restart')
  gameStarted = true
});

button3.addEventListener('click', function (event) {
  const newTrickList = document.querySelector('#Trick-List');
  // Choose a random group of tricks
  const randomGroup = tricks[Math.floor(Math.random() * tricks.length)];

  // Assign displayed tricks to keysToCheck
  keysToCheck = randomGroup.map(trick => trick.split('+').pop().trim().toLowerCase());

  // Update the Trick List
  newTrickList.innerHTML = randomGroup.map(trick => `"${trick}"<br>`).join('');

  // Initialize event listeners
  initializeEventListeners(keysToCheck);
});

/////////////////////////////////////////////////
///////////Randomize and Display keys////////////
/////////////////////////////////////////////////

let tricks = [
  [`a`,`g`,`p`],
  [`e`,`b`,`Tab`],
  [`r`,`t`,`m`],
  [`q`,`w`,`l`],
  [`r`,`s`,`h`],
  [`k`,`b`,`Tab`],
  [`j`,`b`,`a`],
  [`v`,`b`,`l`],
  [`k`,`e`,`z`],
  [`k`,`b`,`Tab`],
];

function listenForKeys(keys, callback) {
  const pressedKeys = new Set();

  function keydownHandler(event) {
      const key = event.key.toLowerCase(); 

      if (keys.includes(key)) {
          pressedKeys.add(key);
          checkKeys();
          event.preventDefault();
      }
  }

  function keyupHandler(event) {
      const key = event.key.toLowerCase();

      if (keys.includes(key)) {
          pressedKeys.delete(key);
      }
  }

  function checkKeys() {
      if (keys.every(key => pressedKeys.has(key))) {
        callback();
      }
  }

  // Add event listeners
  document.addEventListener('keydown', keydownHandler);
  document.addEventListener('keyup', keyupHandler);

  // Return a function to remove the event listeners when needed
  return function removeListeners() {
      document.removeEventListener('keydown', keydownHandler);
      document.removeEventListener('keyup', keyupHandler);
  };
}

function initializeEventListeners(keys) {
  // Listen for keys in keysToCheck
  listenForKeys(keys, () => {
    // When all keys are pressed >>>
      if (loseState === true){
        if (tonyHawk.skill < Math.floor(Math.random()*10)){
          tonyHawk.log(`Tony: Wiped out! You get a LETTER!`)
          checkLetters(tonyHawk);
        } else {tonyHawk.log(`Tony: Saved!`);  
        }
      }
        checkSkillAndScore();
  });
}

//////////////////////////////////////////////////
////////////////Score Check///////////////////////
/////////////////////////////////////////////////
function updateScore() {
  statusParagraph.textContent = `Tony's Letters: ${tonyHawk.letters}`;
  statusParagraph1.textContent = `Opponent's Letters: ${opponent.letters}`;
}

function restartWindow() {
  location.reload();
}

function checkLetters (player) {
  if (gameStarted) {
        if (!player.letters.includes('S')) {
            player.letters += 'S';
        } else if (!player.letters.includes('K')) {
            player.letters += 'K';
        } else if (!player.letters.includes('A')) {
            player.letters += 'A';
        } else if (!player.letters.includes('T')) {
            player.letters += 'T';
        } else if (!player.letters.includes('E')) {
            player.letters += 'E';
        } else if (!player.letters.includes('R')) {
          player.letters += 'R';
        }
        updateScore(player);
        if (tonyHawk.letters.includes('SKATER')) {
          updateScore(player);
            setTimeout(() => {
              window.alert(`You got "SKATER". You Lost...Try Again!`);
              restartWindow();
            },  500);
         
        } else if(opponent.letters.includes('SKATER')) {
            updateScore(player);
            setTimeout(() => {
              window.alert(`Opponent got "SKATER". You Wins!`);
              restartWindow();
            },  500);
       }
    }
}

/////////////////////////////////////////////////
///////////LOGIC To Determine Game Letters///////
////////////////////////////////////////////////



function opponentFollows(){
  const setRandomNum1 = Math.floor(Math.random()*10);
  if (opponent.skill < setRandomNum1) {
    opponent.log('Opponent: Wiped out! LETTER added!')
    checkLetters(opponent);
    oLoseState = false;
  } else{
    opponent.log('Opponent: Trick Executed! No LETTER.')
    oLoseState = false;
  }
}

function checkSkillAndScore() {
const setRandomNum = Math.floor(Math.random()*10);
const setRandomNum1 = Math.floor(Math.random()*10);
  
  if (loseState === false && gameStarted){
    if (tonyHawk.skill > setRandomNum) {
      tonyHawk.log(`Tony: Trick Set!`)
      opponentFollows();
      oLoseState = true;
    } else if( tonyHawk.skill < setRandomNum){
      tonyHawk.log(`Tony: Trick not set.`)
      oLoseState = false;
    } 
  }

  if(oLoseState === false && gameStarted){
    if (opponent.skill > setRandomNum1){
      opponent.log(`Opponent: Trick Set!`);
      loseState = true;
    } else if( opponent.skill < setRandomNum1) {
      opponent.log(`Opponent: Trick not set.`)
      loseState = false;
    }
  }
} 



