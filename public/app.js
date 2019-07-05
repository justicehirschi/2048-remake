// var url = "http://localhost:8080" // localhost
var url = "https://my-2048-remake.herokuapp.com" // heroku server

// Requests to server

// List
let getScores = function() {
    fetch(`${url}` + "/scores").then(response => {
        response.json().then(scores => {
            var scoreList = document.querySelector("#high-scores-list");
            scores.forEach(score => {
                var item = document.createElement("li");
                item.innerHTML = score.name + ": " + score.score;
                scoreList.appendChild(item);
            });
        });
    });
};

// Create
let createScore = function(initials, gameScore) {
    var data = `name=${encodeURIComponent(initials)}`;
    data += `&score=${encodeURIComponent(gameScore)}`;

    fetch(`${url}` + "/scores", {
        method: "POST",
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        },
        body: data
    });
};

var board = {};

var tileKey = function (col, row) {
    return "tile" + col + "-" + row;
};

var createBoard = function () {
    var boardDiv = document.querySelector("#board");

    for (var row = 0; row < 4; row += 1) {
        var rowDiv = document.createElement("div");
        rowDiv.classList.add("row");
        boardDiv.appendChild(rowDiv);

        for (var col = 0; col < 4; col += 1) {
            var tileDiv = document.createElement("div");
            tileDiv.classList.add("tile");
            tileDiv.id = tileKey(col, row);
            rowDiv.appendChild(tileDiv);
        }
    }
};

var updateBoard = function () {
    for (var row = 0; row < 4; row += 1) {
        for (var col = 0; col < 4; col += 1) {
            var key = tileKey(col, row);
            // query the tile element.
            var tileDiv = document.querySelector("#" + key);
            // retrieve the value from the board object.
            var value = board[key];
            // set the innerHTML of the tile element.
            tileDiv.className = "tile";
            if (value) {
                tileDiv.innerHTML = value;
                tileDiv.classList.add("tile-" + value);
            } else {
                tileDiv.innerHTML = "";
            }
        }
    }
};

var getEmptyTiles = function () {
    var empty = [];
    for (var row = 0; row < 4; row += 1) {
        for (var col = 0; col < 4; col += 1) {
            var key = tileKey(col, row);
            var value = board[key];
            if (!value) {
                empty.push(key);
            }
        }
    }
    return empty;
};

var addOneTile = function () {
    var emptyTiles = getEmptyTiles();
    var randomIndex = Math.floor(Math.random() * emptyTiles.length);
    var randomEmptyTile = emptyTiles[randomIndex];

    board[randomEmptyTile] = Math.random() < 0.9 ? 2 : 4;
};

var combineNumbers = function (numbers) {
    var newNumbers = [];

    while (numbers.length > 0) {
        if (numbers.length == 1) {
            newNumbers.push(numbers[0]);
            numbers.splice(0, 1);
        } else if (numbers[0] == numbers[1]) {
            newNumbers.push(numbers[0] + numbers[1]);
            numbers.splice(0, 2);
        } else {
            newNumbers.push(numbers[0]);
            numbers.splice(0, 1);
        }
    }

    while (newNumbers.length < 4) {
        newNumbers.push(undefined);
    }

    return newNumbers;
};

var getNumbersInRow = function (row) {
    var nums = [];
    for (var col = 0; col < 4; col += 1) {
        var key = tileKey(col, row);
        var value = board[key];
        if (value) {
            nums.push(value);
        }
    }
    return nums;
};

var getNumbersInCol = function (col) {
    var nums = [];
    for (var row = 0; row < 4; row += 1) {
        var key = tileKey(col, row);
        var value = board[key];
        if (value) {
            nums.push(value);
        }
    }
    return nums;
};

var setNumbersInRow = function (row, nums) {
    for (var col = 0; col < 4; col += 1) {
        var key = tileKey(col, row);
        board[key] = nums[col];
    }
};

var setNumbersInCol = function (col, nums) {
    for (var row = 0; row < 4; row += 1) {
        var key = tileKey(col, row);
        board[key] = nums[row];
    }
};

var combineRowLeft = function (row) {
    var nums = getNumbersInRow(row);
    var newNums = combineNumbers(nums);
    setNumbersInRow(row, newNums);
};

var combineColUp = function (col) {
    var nums = getNumbersInCol(col);
    var newNums = combineNumbers(nums);
    setNumbersInCol(col, newNums);
};

var combineRowRight = function (row) {
    var nums = getNumbersInRow(row);
    nums = nums.reverse();
    var newNums = combineNumbers(nums);
    newNums = newNums.reverse();
    setNumbersInRow(row, newNums);
};

var combineColDown = function (col) {
    var nums = getNumbersInCol(col);
    nums = nums.reverse();
    var newNums = combineNumbers(nums);
    newNums = newNums.reverse();
    setNumbersInCol(col, newNums);
};

var combineDirection = function (direction) {
    // make a (deep) copy of the board
    var oldBoard = Object.assign({}, board);

    for (var n = 0; n < 4; n += 1) {
        if (direction == "left") {
            combineRowLeft(n);
        } else if (direction == "right") {
            combineRowRight(n);
        } else if (direction == "up") {
            combineColUp(n);
        } else if (direction == "down") {
            combineColDown(n);
        }
    }

    if (didBoardChange(oldBoard)) {
        addOneTile();
        updateBoard();
    }
    checkIfGameIsOver();
};

var didBoardChange = function (oldBoard) {
    for (var row = 0; row < 4; row += 1) {
        for (var col = 0; col < 4; col += 1) {
            var key = tileKey(col, row);
            if (board[key] != oldBoard[key]) {
                return true;
            }
        }
    }
    return false;
};

document.onkeydown = function (e) {
    if (e.which == 37) {
        combineDirection("left");
    } else if (e.which == 39) {
        combineDirection("right");
    } else if (e.which == 40) {
        combineDirection("down");
    } else if (e.which == 38) {
        combineDirection("up");
    }
    showScore();
};

var resetButton = document.querySelector("#new-game-button");
resetButton.onclick = function() {

    resetBoard();
};

var resetBoard = function() {
    var gameOverDiv = document.querySelector("#game-over");
    gameOverDiv.innerHTML = "";
    board = {};
    addOneTile();
    addOneTile();
    updateBoard();
    showScore();
};

// Game Over

var checkIfGameIsOver = function() {
    // Check every tile to see if there is a number
    for(var row = 0; row < 4; row++) {
        for(var col = 0; col < 4; col++) {
            var key = tileKey(col, row);
            if(board[key] == undefined) {
                // If there is an empty tile
                return;
            }
        }
    }
    // Every tile is full
    // Now check if player can move
    for(var row = 0; row < 4; row++) {
        var rowNums = getNumbersInRow(row);
        if (rowNums[0] == rowNums[1] || rowNums[1] == rowNums[2] || rowNums[2] == rowNums[3]) {
            return;
        }
    }
    for (var col = 0; col < 4; col++) {
        var colNums = getNumbersInCol(col);
        if (colNums[0] == colNums[1] || colNums[1] == colNums[2] || colNums[2] == colNums[3]) {
            return;
        }
    }

    var gameOverDiv = document.querySelector("#game-over-page");
    gameOverDiv.style.display = "block";
};

var showScore = function() {
    var total = 0;
    for(var row = 0; row < 4; row++) {
        for(var col = 0; col < 4; col++) {
            var key = tileKey(col, row);
            if(board[key] != undefined) {
                total += board[key];
            }
        }
    }
    var score = document.querySelector("#score");
    score.innerHTML = "Score: " + total;

    var finalScore = document.querySelector("#final-score");
    finalScore.innerHTML = total;
};

var submitScoreButton = document.querySelector("#submit-score-button");
submitScoreButton.onclick = function() {
    submitScore();
};

var submitScore = function() {
    var initials = document.querySelector("#name-field");
    var score = document.querySelector("#final-score");

    if(initials.value == "") {
        var addInitials = document.querySelector("#add-initials");
        addInitials.innerHTML = "Add Initials";
        return;
    }
    else {
        createScore(initials.value, score.innerHTML);
        var gameOverDiv = document.querySelector("#game-over-page");
        gameOverDiv.style.display = "none";

        initials.value = "";

        showHighScores();
    }
};

// High Scores Page

var showHighScoresButton = document.querySelector("#high-scores-button");
showHighScoresButton.onclick = function() {
    showHighScores();
};

var showHighScores = function() {
    var header = document.querySelector("header");
    header.style.display = "none";
    var main = document.querySelector("main");
    main.style.display = "none";
    var footer = document.querySelector("footer");
    footer.style.display = "none";

    var highScores = document.querySelector("#high-scores-page");
    highScores.style.display = "block";

    getScores();
};

var backToMainButton = document.querySelector("#back-button");
backToMainButton.onclick = function() {
    showMain();
};

var showMain = function () {
    var header = document.querySelector("header");
    header.style.display = "block";
    var main = document.querySelector("main");
    main.style.display = "block";
    var footer = document.querySelector("footer");
    footer.style.display = "block";

    var highScores = document.querySelector("#high-scores-page");
    highScores.style.display = "none";

    var scoresList = document.querySelector("#high-scores-list");
    var li = scoresList.getElementsByTagName("li");
    while (li.length > 0) {
        scoresList.removeChild(li[0]);
    }
};

createBoard();
addOneTile();
addOneTile();
updateBoard();
showScore();
