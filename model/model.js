//"use strict";


function getDisplayName (user) {
    if (user && user.username) {
        return user.username;
    }
        return 'Guest';
}

user = 'vlad';
user.username = 13;

console.log(getDisplayName());
console.log(getDisplayName(user));


var state;

function gameState(row, col, numOfMines) {
    this.row = row;
    this.col = col;
    this.numOfMines = numOfMines;
    this.flagsCount = numOfMines;
    this.numOfUncovered = this.row * this.col;
    console.log("Uncovered upon creation: ", this.numOfUncovered);
    this.grid = this.buildGrid();
    this.placeMines(numOfMines);
    this.placeNumbers();
    this.isGameActive = false;
    this.time = 0;
}

gameState.prototype.buildGrid = function() {
    var gameGrid = new Array;
    for (var i = 0; i < this.row; i++) {
        gameGrid[i] = new Array(this.col).fill(0);
    }
    return gameGrid;
}

gameState.prototype.placeMines = function(numOfMines) {
    for(let i = 0; i < numOfMines; i++) {
        let row  = Math.floor(Math.random() * this.row);
        let col = Math.floor(Math.random() * this.col);
        if (this.grid[row][col] !== 9) {
            this.grid[row][col] = 9;
            this.placeNumbers(row,col)
        }
        else {
            i--;
        }
    }
}

gameState.prototype.placeNumbers = function(row, col) {
    for (var v = row - 1; v < row + 2; v++) {
        for (let h = col - 1; h < col + 2; h++) {
            try {
                if (this.grid[v][h] < 9) {
                    this.grid[v][h] += 1;
                }
            }
            catch (e) {
            }
        }
    }
}

gameState.prototype.getSquare = function(row, col) {
    return this.grid[row][col];
}

gameState.prototype.setSquare = function(row, col, val) {
    this.grid[row][col] = val;
}

gameState.prototype.amIWinner = function() {
    this.numOfUncovered--;
    console.log("Uncovered: ", this.numOfUncovered);
    console.log("Mines: ", this.numOfMines);
    if (this.numOfUncovered === this.numOfMines) {
        won.play()
        setTimer()
        storePlayer()
    }
}

function storePlayer(player){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    if (player) {
        localStorage.setItem(dateTime, "Player lost in " + state.time + " seconds with " + state.flagsCount + " mines to go.");
    }
    else{
        localStorage.setItem(dateTime, "Player won in " + state.time + " seconds");
    }
}



function createGame(row, col, numOfMines) {
    state = new gameState(row, col, numOfMines);
}

function loadJSONState() {
    /*I had to transfer all the values just beacuse all the functions are
    in the prototype of the gameState object.
    There must be a better way to do that, but I'm too tired and the due 
    time is coming.*/
    var request = new XMLHttpRequest();
    request.open("GET", "model/gameState.json", false);
    request.send(null);
    var JSONstate = JSON.parse(request.response);
    state = new gameState(13, 13, 5);
    state.row = JSONstate.row;
    state.col = JSONstate.col;
    state.numOfMines = JSONstate.numOfMines;
    state.flagsCount = JSONstate.flagsCount;
    state.numOfUncovered = JSONstate.numOfUncovered;
    state.grid = JSONstate.grid;
    state.isGameActive = JSONstate.isGameActive;
    state.time = JSONstate.time;
}
