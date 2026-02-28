const Gameboard = (function() {
    // Private variable-only this modeule can acees it
    let board = ["","","","","","","","",""]

    const setMark = function(index,mark){
        if(board[index]===""){
            board[index] = mark;
            return true // success 
        }
        return false // Slot was taken
    };

    const getmark = function(index){
        return board[index]
    }

    const reset = function(){
        board = ["","","","","","","","",""]
    }

    const getBoard = function (){
        return board
    }

    return {
        setMark,
        getmark,
        reset,
        getBoard
    }
})()


// console.log("Stating board:",Gameboard.getBoard());

// Gameboard.setMark(0,"X")
// console.log(Gameboard.getBoard());

// Gameboard.setMark(4,"0")
// console.log(Gameboard.getBoard());

// gameboard.setMark(0,"O")
// console.log(Gameboard.getBoard());


function createPlayer(name,mark){
    return{
        name,
        mark
    }
}

const player1 = createPlayer("Alice","X");
const player2 = createPlayer("Bob","O")
console.log("player 1",player1);
console.log("player 2",player2);


const GameController = (function(){
       let players = [];
       let currentPlayerIndex = 0;
       let gameOver = false;

       const winningCombinations = [
           [0,1,2],
           [3,4,5],
           [6,7,8],
           [0,3,6],
           [1,4,7],
           [2,5,8],
           [0,4,8],
           [2,4,6]
        ]
   

    const startGame = function(player1Name,player2Name) {
        players = [
            createPlayer(player1Name,"X"),
            createPlayer(player2Name,"O")
        ];
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.reset();
    };

      const checkWinner = function(){
        //Loop through each winning combination
        for (let i = 0; i < winningCombinations.length; i++){
          combo = winningCombinations[i]

            
             //Get the three positions from the combination
             const pos1 = Gameboard.getmark(combo[0]);
             const pos2 = Gameboard.getmark(combo[1]);
             const pos3= Gameboard.getmark(combo[2]);
             
             //Check if all three match and aren't empty
        if (pos1 !=="" && pos1 ===pos2 && pos2 ===pos3){
            return pos1 // return the winning mark("X" or "O")
        }
    }
        return null; // No winner yet
        
    };
    const checkTie = function(){
        const board = Gameboard.getBoard();
        for (let i = 0; i <board.length; i++) {
            if(board[i] ===""){
                return false
            }
        }
        return true
    }
    const playRound = function(index){
        if (gameOver){  
            return null;
        }
        const currentPlayer = players[currentPlayerIndex];
        const success = Gameboard.setMark(index,currentPlayer.mark);

        if(!success) {
            return null
        }

        const winner = checkWinner();
        if (winner) {
            gameOver = true;
            return {winner:currentPlayer.name,gameOver:true};
        }

        if (checkTie()) {
            gameOver = true;
            return {tie:true, gameOver: true};
        }

        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0
        return {success:true}
    }
    const getCurrentPlayer = function(){
        return players[currentPlayerIndex]
    }
     const isGameOver = function() {
        return gameOver;
     }
    return {
        startGame,
        playRound,
        getCurrentPlayer,
        isGameOver
    };
     })();
    // Testing the code
    //  Gameboard.setMark(0,"X");
    //  Gameboard.setMark(1,"X")
    //  Gameboard.setMark(2,"X")

    //  console.log("Board",Gameboard.getBoard ());
    //  console.log("Winner",GameController.checkWinner());

// Start a new game
GameController.startGame('Alice', 'Bob');
console.log('Game started!');
console.log('Current player:', GameController.getCurrentPlayer());

// Play a complete game
console.log('\n--- Playing moves ---');
console.log('Move 1:', GameController.playRound(0)); // Alice (X) at 0
console.log('Board:', Gameboard.getBoard());

console.log('Move 2:', GameController.playRound(3)); // Bob (O) at 3
console.log('Board:', Gameboard.getBoard());

console.log('Move 3:', GameController.playRound(1)); // Alice (X) at 1
console.log('Board:', Gameboard.getBoard());

console.log('Move 4:', GameController.playRound(4)); // Bob (O) at 4
console.log('Board:', Gameboard.getBoard());

console.log('Move 5:', GameController.playRound(2)); // Alice (X) at 2 - WINS!
console.log('Board:', Gameboard.getBoard());


const DisplayController = (function() {
  const setupDiv = document.getElementById('setup');
  const gameContainer = document.getElementById('gameContainer');
  const startBtn = document.getElementById('startBtn');
  const restartBtn = document.getElementById('restartBtn');
  const messageElement = document.getElementById('message');
  const cellElements = document.querySelectorAll('.cell');
  const player1Input = document.getElementById('player1');
  const player2Input = document.getElementById('player2');
  
  const init = function() {
    startBtn.addEventListener('click', handleStartGame);
    restartBtn.addEventListener('click', handleRestart);
    
    cellElements.forEach(cell => {
      cell.addEventListener('click', handleCellClick);
    });
  };
  
  const handleStartGame = function() {
    const player1Name = player1Input.value || 'Player 1';
    const player2Name = player2Input.value || 'Player 2';
    
    GameController.startGame(player1Name, player2Name);
    
    setupDiv.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    
    updateMessage();
    renderBoard();
  };
  
  const updateMessage = function() {
    if (GameController.isGameOver()) {
      return;
    }
    
    const currentPlayer = GameController.getCurrentPlayer();
    messageElement.textContent = `${currentPlayer.name}'s turn (${currentPlayer.mark})`;
  };
  
  const renderBoard = function() {
    const board = Gameboard.getBoard();
    
    cellElements.forEach((cell, index) => {
      cell.textContent = board[index];
      cell.disabled = board[index] !== '';
    });
  };
  
  const handleCellClick = function(event) {
    const index = event.target.dataset.index;
    
    const result = GameController.playRound(index);
    
    if (!result) {
      return;
    }
    
    renderBoard();
    
    if (result.gameOver) {
      if (result.winner) {
        messageElement.textContent = `🎉 ${result.winner} wins!`;
      } else if (result.tie) {
        messageElement.textContent = `🤝 It's a tie!`;
      }
    } else {
      updateMessage();
    }
  };
  
  const handleRestart = function() {
    setupDiv.classList.remove('hidden');
    gameContainer.classList.add('hidden');
    
    player1Input.value = '';
    player2Input.value = '';
    
    cellElements.forEach(cell => {
      cell.textContent = '';
      cell.disabled = false;
    });
  };
  
  return {
    init
  };
})();

// Initialize the display when page loads
DisplayController.init();