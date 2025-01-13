"use strict";
var cells, click, explosion, flag, won, timer;


function drawTable(row, col) {
    var x, y, table, grid;
    table = document.createElement('table');
    table.appendChild(document.createElement('tbody'))
    for (x = row; x > 0; x--) {
        var newRow = document.createElement('tr');
        for (y = col; y > 0; y--) {
            var cell = document.createElement('td');
            cell.addEventListener('click', uncover);
            cell.addEventListener('contextmenu', setFlag);
            newRow.appendChild(cell);
        }
        table.lastChild.appendChild(newRow);
    }
    grid = document.getElementById('grid');
    grid.innerHTML = '';
    grid.appendChild(table);
    minesLeft();
    cells = document.getElementsByTagName('td');
    click = document.getElementById('click');
    explosion = document.getElementById('explosion');
    flag = document.getElementById('flag');
    won = document.getElementById('won');
    
    displayHistory()

}

function minesLeft(operator) {
    if (operator === 1) {
        state.flagsCount--;
    } else if (operator === 2) {
        state.flagsCount++;
    }
    var minesLeft, minesLeftDiv;
    minesLeft = document.createTextNode(state.flagsCount);
    minesLeftDiv = document.getElementById('minesLeft');
    minesLeftDiv.innerHTML = '';
    minesLeftDiv.appendChild(minesLeft);
}

function uncover(event) {
    if (! state.isGameActive) {
        setTimer();
    }
    var value = state.getSquare(this.parentNode.rowIndex, this.cellIndex)
    if (value === 9) {
        explosion.play();
        this.innerHTML = "<img src='view/bomb.png'>";
        this.removeEventListener('click', uncover);
        this.removeEventListener('contextmenu', setFlag);
        uncoverAll();
        setTimer();
        storePlayer('loser')
    } else {
        click.play()
        if (value > -1) {
            uncoverAdjacent(this);
        } 

    }
}

function uncoverAdjacent(cell) {
    var row, col, rows, content;
    rows = document.getElementsByTagName('tr');
    row = cell.parentNode.rowIndex;
    col = cell.cellIndex;
    content = state.getSquare(row, col);
    
    if (content === 0){
        console.log(" x:", col, "y:", row, " Content:", content);
        state.setSquare(row, col, -1);
        cell.innerHTML = "";
        cell.classList.add("heighlight");
        removeListeners(cell, 3);
        state.amIWinner();
        try {
            uncoverAdjacent(rows[row-1].childNodes[col]);
            uncoverAdjacent(rows[row+1].childNodes[col]);
            uncoverAdjacent(rows[row].childNodes[col-1]);
            uncoverAdjacent(rows[row].childNodes[col+1]);
            uncoverAdjacent(rows[row-1].childNodes[col-1]);
            uncoverAdjacent(rows[row+1].childNodes[col+1]);
            uncoverAdjacent(rows[row-1].childNodes[col+1]);
            uncoverAdjacent(rows[row+1].childNodes[col-1]);
        } catch(e) { }
    }
        
    else if (content > 0 && content < 9) {
        console.log(" x:", col, "y:", row, " Content:", content);
        removeListeners(cell, 3);
        cell.innerHTML = content;
        state.setSquare(row, col, -content);
        console.log(" Content after negating:", state.getSquare(row, col));
        cell.classList.add("heighlight");
        state.amIWinner();
    }
}

function setTimer() {
    var time = document.getElementById('timer');
    if (! state.isGameActive) {
        state.isGameActive = true;
        timer = setInterval(() => {
            state.time++;
            time.innerHTML = state.time;
        }, 1000);
    }
    else {
        state.isGameActive = false
        clearTimeout(timer);
    }
}

function displayHistory() {
    var hist = document.getElementById('history');
    for (var i = 0; i < localStorage.length; i++) {
        var innerDiv = document.createElement('div');
        innerDiv.innerHTML =  localStorage.key(i) +':' + ' ' + localStorage.getItem(localStorage.key(i));
        hist.appendChild(innerDiv);
    }
}

function uncoverAll() {
    var i;
    for (i = 0; i < cells.length; i++) {
        removeListeners(cells[i], 3);
        var cellContent = state.getSquare(Math.floor(i/state.col), i%state.col);
        if (cellContent === 9) {
            cells[i].innerHTML = "<img src='view/bomb.png'>";
            cells[i].classList.toggle("heighlight");
        }
    }
}

function setFlag(event) {
    event.preventDefault();
    if (event.target.nodeName == 'TD') {
        flag.play();
        removeListeners(this, 1);
        event.target.innerHTML = "<img src='view/flag.png'>";
        minesLeft(1);
    }
    else {
        this.addEventListener('click', uncover);
        event.target.parentNode.innerHTML = "";
        minesLeft(2);
    }
}

function removeListeners(target, listener) {
    if (listener === 1) {
        target.removeEventListener('click', uncover);
    }  else if (listener === 2) {
        target.removeEventListener('contextmenu', setFlag);
    } else {
        target.removeEventListener('contextmenu', setFlag);
        target.removeEventListener('click', uncover);
    }
}

function setDifficulty(event) {
    if (! event) {
        createGame(9, 9, 10);
        drawTable(9, 9);
    } else if (event.target.selectedIndex === 0) {
        createGame(9, 9, 10);
        drawTable(9, 9);
    } else if (event.target.selectedIndex === 1) {
        createGame(16, 16, 40);
        drawTable(16, 16);
    } else if (event.target.selectedIndex === 2) {
        createGame(16, 30, 99);
        drawTable(16, 30);
    } else if (event.target.selectedIndex === 3) {
        loadJSONState();
        drawTable(13, 13);
    }
}