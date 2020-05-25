var matrixSize = 3;
var universalScore = 1;
/*#### n-digit by m-digit matrix ####*/
var n = 2,
    m = 2;
/*#### ScoreCard (R(+1)/E(-0.25)/W(-0.5) ####*/

var numCol = [],
    numRow = [];
var calculatedProdSheet = [[], [], []],
    userResponseProdSheet = [[], [], []];
var calculatedSumCol = [0, 0, 0],
    calculatedSumRow = [0, 0, 0];
var userResponseSumCol = [],
    userResponseSumRow = [];
var calculatedTotalSum = 0,
    userInputTotalSum = 0;

var startTime;
var totalTime = 0;
var totalScore = 0;
var isGameStart = false,
    isGamePaused = false;

var resetDoc = document.getElementById("mathsheet").innerHTML;
var clearDoc;

/**
 * Start Game
 */
function startGame() {
    if (!isGameStart) {
        initVar();
        numGenerator();
        // to create a copy incase of clearing user input.
        clearDoc = document.getElementById("baseTable").innerHTML;
    }
}

/**
 * Initialize variables.
 */
function initVar() {
    isGameStart = true;

    numCol = [];
    numRow = [];
    calculatedProdSheet = [[], [], []];
    userResponseProdSheet = [[], [], []];
    calculatedSumCol = [0, 0, 0];
    calculatedSumRow = [0, 0, 0];
    userResponseSumCol = [];
    userResponseSumRow = [];
    calculatedTotalSum = 0;
    userInputTotalSum = 0;

    startTime = new Date();
    totalTime = 0;
    totalScore = 0;
    // reseting the game when new game starts.
    document.getElementById("mathsheet").innerHTML = resetDoc;
}

/**
 * Generates random numbers for game.
 */
function numGenerator() {
    var rowMin = Math.pow(10, n - 1) + 1;
    var colMin = Math.pow(10, m - 1) + 1;
    var rowMax = Math.pow(10, n);
    var colMax = Math.pow(10, m);
    var i, j;
    for (i = 0; i < matrixSize; i++) {

        numRow[i] = Math.floor((rowMax - rowMin) * Math.random() + rowMin);
        numCol[i] = Math.floor((colMax - colMin) * Math.random() + colMin);

        document.getElementById("num-" + (i + 1) + "0").innerHTML = numRow[i];
        document.getElementById("num-0" + (i + 1)).innerHTML =
            numCol[i];
    }
    for (i = 0; i < matrixSize; i++) {
        for (j = 0; j < matrixSize; j++) {
            var temp = numRow[i] * numCol[j];
            calculatedProdSheet[i][j] = temp;
            calculatedSumCol[j] += temp;
            calculatedSumRow[i] += temp;
            calculatedTotalSum += temp;
        }
    }
}

/** 
 * Evaluate UserPerformance to generate ResponseSheet.
 */
function submit() {
    if (isGameStart) {
        isGameStart = false;
        getStopWatch();
        getResponseSheet();
        getResultCard();
    }
}

/** 
 * Time taken by user to complete SpeedSheet.
 */
function getStopWatch() {
    totalTime += parseFloat((new Date() - startTime) / 1000);
    totalTime = Math.floor(totalTime / 60) + ":" + Math.floor(totalTime % 60);
    document.getElementById("stopWatch").innerHTML =
        "Time(" + totalTime + ")";
}

/** 
 * Collecting user response.
 */
function getResponseSheet() {

    for (var i = 0; i < matrixSize; i++) {
        for (var j = 0; j < matrixSize; j++) {
            /*#### productSheet ####*/
            userResponseProdSheet[i][j] = parseInt(document.getElementById("prod-" + (i + 1) + (j + 1)).value);
        }
        /*#### sumRows&Columns ####*/
        userResponseSumCol[i] =
            parseInt(document.getElementById("colSum-" + (i + 1)).value);
        userResponseSumRow[i] =
            parseInt(document.getElementById("rowSum-" + (i + 1)).value);
    }

    /*#### totalSum ####*/
    userInputTotalSum = parseInt(
        document.getElementById("totalSum").value);
}

/** 
 * Evaluating user response to create score.
 */
function getResultCard() {
    var localScore = 0,
        totalCorrectNumbers = 0,
        totalNumbers = 0;

    /*#### productScore ####*/
    for (var i = 0; i < matrixSize; i++) {
        for (var j = 0; j < matrixSize; j++) {
            localScore = getScore(userResponseProdSheet[i][j], calculatedProdSheet[i][j], "prod-" + (i + 1) + (j + 1), universalScore);
            totalNumbers++;
            if (localScore > 0) {
                totalCorrectNumbers++;
            }
            totalScore += localScore;
        }
    }

    /*#### sumRows&Columns ####*/
    for (i = 0; i < matrixSize; i++) {
        localScore = getScore(userResponseSumCol[i], calculatedSumCol[i], "colSum-" + (i + 1), universalScore);
        totalNumbers++;
        if (localScore > 0) {
            totalCorrectNumbers++;
        }
        totalScore += localScore;

        localScore = getScore(userResponseSumRow[i], calculatedSumRow[i], "rowSum-" + (i + 1), universalScore);
        totalNumbers++;
        if (localScore > 0) {
            totalCorrectNumbers++;
        }
        totalScore += localScore;
    }

    /*#### totalSum ####*/
    localScore = getScore(userInputTotalSum, calculatedTotalSum, "totalSum", universalScore);
    totalNumbers++;
    if (localScore > 0) {
        totalCorrectNumbers++;
    }
    totalScore += localScore;

    document.getElementById("score").innerHTML = "Score(" +
        totalScore + ")";
    document.getElementById("accu").innerHTML = "Accu(" +
        Math.round(((totalCorrectNumbers / totalNumbers * 100) + Number.EPSILON) * 100) / 100 + ")";
}

/** 
 * Matches userInput with calculated and retturns score(1,-0.5,-0.25)
 */
function getScore(userInput, calculated, id, score) {
    setAnswers(id, calculated);
    if (Number.isNaN(userInput)) {
        document.getElementById(id).parentNode.classList.add('emptyBox');
        score = -score / 2;
    } else if (userInput == calculated) {
        document.getElementById(id).parentNode.classList.add('rightBox');
    } else {
        document.getElementById(id).parentNode.classList.add('wrongBox');
        score = -score / 4;
    }
    return score;
}

/** 
 * Set answers so user can learn correct answers.
 */
function setAnswers(id, calculated) {
    document.getElementById(id).addEventListener("mouseover",
        function (event) {
            document.getElementById("answer").innerHTML = calculated;
        });
    document.getElementById(id).addEventListener("mouseout",
        function (event) {
            document.getElementById("answer").innerHTML = "Answer";
        });
}

/** 
 * Pause the game during gameplay..
 */
function pauseGame() {
    if (!isGamePaused && isGameStart) {
        isGamePaused = true;
        totalTime += parseFloat((new Date() - startTime) / 1000);
        document.getElementById("pause_play").innerHTML =
            "Play";
        document.getElementById("baseTable").style.display = "none";

    } else if (isGamePaused && isGameStart) {
        isGamePaused = false;
        startTime = new Date();
        document.getElementById("baseTable").style.display = "block";
    } else {
        window.alert("Game has not started yet !");
    }
}

/** 
 * Clears the typed responses.
 */
function reset() {
    if (isGameStart && !isGamePaused) {
        document.getElementById("baseTable").innerHTML = clearDoc;
    }
}