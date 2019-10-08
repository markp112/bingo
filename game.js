// main code for the game



// this array is used to hold a place holder for each of the numbers between 1 and 90 which holds the number and a flag which indicates if this number has already been picked
let bingoNumbers = [];
let gameNumbers = [];
let playerCard = [];
let numberOfCards = 2;

// this function initialises our bingoNumbers array by filling it with bingoNumber objects numbered 1 to 90 with a the flag set to false
const initBingoNumbers = () => {
    let arrayToInitialise = [];

    for (let row = 0; row < 9; row++) {
        let rowNumbers = [];
        for (let col = 0; col < 10; col++) {
            let bingoNumber = {
                value: col + row * 10,
                isPicked: false
            };
            rowNumbers.push(bingoNumber);
        }
        arrayToInitialise.push(rowNumbers);
    }
    return arrayToInitialise;
};

//fill an array with the numbers 1 to 90
const initGameNumbers = () => {
    let arrayToInitialise = [];
    for (let index = 1; index < 91; index++) {
        const cell = {
            value: index,
            isPicked: false
        };
        arrayToInitialise.push(cell);
    }
    return arrayToInitialise;
}

// initialises the players card
// i.e. sets up the structure of the card
const initCard = () => {
    let card = [];
    for (let indexRow = 0; indexRow < 18; indexRow++) {
        let row = [];
        for (let indexCol = 0; indexCol < 9; indexCol++) {
            let cell = {
                value: -1,
                isBlank: true,
                isPicked: false
            }
            row.push(cell);
        }
        card.push(row);
    }
    return card;
}

// generate a random number between min and max
const getRandom = (min, max) => {
    return parseInt(Math.random() * (max - min) + min);
}

// for each column in the players card generate numBlanks blank squares
// input: numBlanks - number of blanks to be created
// output: array of numbers between 0 and 18, generated randomly which represent the cells
// on the players card that will be blank
const createBlanks = numBlanks => {
    let blanks = [];
    let isComplete = false;
    while (!isComplete) {
        let random = getRandom(0, 18);
        // only add numbers not already in the array
        if (!blanks.includes(random)) blanks.push(random);
        if (blanks.length === numBlanks) isComplete = true;
    }
    return blanks;
}

// using the unique number and the index of column return the 
// reference back to the actual cell in bingoNumbers matrix
const getColumnRef = (uniqueNumber, indexCol) => {
    return uniqueNumber - indexCol * 10;
};

// getUnique random number - return a random number between minRange and MaxRange
// that has not inlcuded in the pickedNumbers array
const getUniqueRandomNumber = (pickedNumbers, minRange, maxRange) => {
    let rand = getRandom(minRange, maxRange);
    while (pickedNumbers.includes(rand)) {
        rand = getRandom(minRange, maxRange);
    }
    return rand;
}

// createPlayerNumbers fill the card with numbers and blank cells based on the maximum rows and columns
const createPlayerNumbers = (card, maxRows, maxCols) => {
    try {
        let pickedNumbers = [];
        for (let indexCol = 0; indexCol < maxCols; indexCol++) {
            // generate the blanks in each column first col has 9 rest have 8
            const blanks = indexCol === 0 ? maxRows : (maxRows - 1);
            const blankCells = createBlanks(blanks);
            pickedNumbers = [];
            for (let indexRow = 0; indexRow < maxRows; indexRow++) {
                // if the current cell is defined as blank set flag to true
                if (blankCells.includes(indexRow)) {
                    card[indexRow][indexCol].isBlank = true;
                } else {
                    // get a unique random number.... To do...
                    // for column 0 numbers 0-9 for column 2 10-19 etc
                    // therefore: for col ===0 col * 10 = 0 and col * 10 + 9 = 9
                    const startValue = indexCol === 0 ?  1 : indexCol * 10;
                    const endValue = indexCol === 8? ((indexCol * 10) + 10) : (indexCol * 10) + 9;
                    const rand = getUniqueRandomNumber(pickedNumbers, startValue, endValue);
                    //record this number as being selected so it is not picked again
                    pickedNumbers.push(rand);
                    card[indexRow][indexCol].value = rand;
                    card[indexRow][indexCol].isBlank = false;
                }
            }
        }
        return true;
    } catch (error) {
        throw new Error(`Failed to createPlayerNumbers --> ${error}`);
    }
};

const fillCard = (card, rows, columns) => {
    try {
        createPlayerNumbers(card, rows, columns);
        return true;
    } catch (error) {
        throw new Error(`Failed to populateNumbers --> ${error}`);
    }
};
// take the players generated numbers and put them on the players card 
// on the screen - 
const putNumbersOnScreenCard = (playerCard) => {
    // get all the cells for the cards that have been put on the screen
    const c2 = document.querySelectorAll('.row .cell');
    let colIndex = 0;
    c2.forEach((cell, index) => {
        const rowIndex = parseInt(index / 9);
        if (!playerCard[rowIndex][colIndex].isBlank) {
            cell.innerHTML += (playerCard[rowIndex][colIndex].value);
        } else {
            cell.classList.add("blank-cell");
        }
        const id = `r${rowIndex}c${colIndex}`
        cell.setAttribute("id", id);
        cell.addEventListener('click', () => {
            markCard(id)
        });
        if (colIndex < 8) {
            colIndex++
        } else {
            colIndex = 0
        };
    });
}

// display the players card on the screen:
// first get a reference to the card contained in the html partials folder
// based on the data in the array playerCard transcribe this to the Html card
// inserting the numbber where a number exists and blank where the cell is blank
const displayCard = (playerCard, numberOfCards) => {
    const importedCard = document.querySelector('#player-card').import;
    const card = importedCard.querySelector('.bingo-card');
    const insertionPoint = document.querySelector("#game-wrapper");
    //inject card into display then populate with numbers
    insertionPoint.appendChild(card);
    putNumbersOnScreenCard(playerCard);
}

// extract the numeric element from the cell ref
// expects startchar to be the character from which we search from in the string
// and endChar the character we stop at cellRef is the string to be searched
// e.g. cell ref is expected to have the format 'r1c1' as in row and column
// startChar might be 'r' or 'c' and end char 'c' or '' to get the rest of the string
const getCellRef = (startChar, endChar, cellRef) => {
    const startPos = cellRef.indexOf(startChar) + 1;
    const endPos = endChar === "" ? cellRef.length : cellRef.indexOf(endChar);
    return cellRef.substring(startPos, endPos);
}

//player has clicked on a cell on the card, mark the card on the screen
const markCard = (id) => {
    if (typeof id === "string") {
        const cell = document.querySelector('#' + id + ' span');
        const row = getCellRef('r', 'c', id);
        const col = getCellRef('c', '', id);
        cell.classList.add('circle2')
        playerCard[row][col].isPicked = true;
    }
}

//pick the next number from the numbers not aleady picked
const pickANumber = (remainingNumbers) => {
    const index = getRandom(0, remainingNumbers.length);
    return remainingNumbers[index].value;
}

//put the next number on the bingo caller
const displayNumberDrawn = (numberToDisplay) => {
    $(".face1").html(numberToDisplay);
}

//show the callers response...
const displayNickName = (numberToCall) => {
    $('#nick-name').html(nickNames[numberToCall]);
}

//when the animation completes an iteration generate the next number
const generateNextNumber = () => {
    const remainingNumbers = gameNumbers.filter(num => num.isPicked === false);
    const numberDrawn = pickANumber(remainingNumbers);
    gameNumbers[numberDrawn - 1].isPicked = true;
    displayNumberDrawn(numberDrawn);
    displayNickName(numberDrawn - 1);
}
// setup the game components
const initialize = (numberOfCards) => {
    bingoNumbers = initBingoNumbers();
    playerCard = initCard();
    let rows = numberOfCards * 3;
    const cols = 9;
    // setup the players card
    if (fillCard(playerCard, rows, cols)) {
        displayCard(playerCard, numberOfCards);
    };
}
//user triggered events
// commence the game
const startTheGame = () => {
    generateNextNumber();
    $('#the-spinner').addClass('cubespinner');
    $('#the-spinner').on('webkitAnimationIteration', generateNextNumber);
    $('#the-spinner').css('-webkit-animation-play-state', 'running');
    $('#start-game').prop('disabled', true);

}

// change the speed of the animation based on the difficulty, at the end of each animation cycle
// the number is "drawn" 
const setAnimationSpeed = difficulty => {
    switch (difficulty) {
        case "easy":
            $('#the-spinner').css('animation-duration','5s');
            break;
        
        case "medium":
            $('#the-spinner').css('animation-duration','2s');
            break;
        case "hard":
            $('#the-spinner').css('animation-duration','1.5s');
            break;
    };
}

// pause the animation whislt the winning numbers are checked
const toggleAnimation = () => {
    $('#the-spinner').css('-webkit-animation-play-state', (i, v) => {
        return v === 'running' ? 'paused' : 'running';
    });
}

//Pick a prize generate a number between 1 and number of prizes in array
const pickAPrize = (whichPrizeSelection) => {
    console.log('pickAPrize :');
    let numPrizes;
    switch (whichPrizeSelection) {
        case "winningLine":
            numPrizes = winningLinePrizes.length;
            return winningLinePrizes[getRandom(0, numPrizes)];
        case "bingo":
            numPrizes = bingoWinningPrize.length;
            return bingoWinningPrize[getRandom(0, numPrizes)]
    }
}

//put the prize on the screen
const displayPrize = (whichLine, prize) => {
    console.log('displayPrize :');
    const imageFolder = "./assets/images/";
    const extension = ".jpg";

    $(whichLine + " img").attr("src", `${imageFolder}${prize}${extension}`);
}

// winning scenarios
// compareArrays - check if the players arrays value are present in the drawn numbers
// expects two sorted arrays of numbers
const compareArrays = (drawnNumbers, playersMatchedNumbers) => {
    if (playersMatchedNumbers.length === 0 || drawnNumbers.length === 0)  return false;
    let matches = 0;
    playersMatchedNumbers.forEach(num => {
    console.log('playersMatchedNumbers :', playersMatchedNumbers);
        if (drawnNumbers.includes(num.value)) matches++;
    })
    console.log('matches :', matches);
    return matches === 0 ? false : matches === playersMatchedNumbers.length;
    
}

// filter the array where cells have isPicked = true,
// returns an array of numbers in sorted order
const getPickedNumbers = (arrayOfCells) => {
    return gameNumbers.map(cell => cell.isPicked ? cell.value : -1)
        .filter(num => num !== -1).sort();
}

// user thinks they have  a winning line check 
// the numbers they have selected against those actually drawn
const winningLine = () => {
    console.log('winningLine :');
    // pause animation
    toggleAnimation();
    const drawnNumbers = getPickedNumbers(gameNumbers);
    playerCard.forEach(row => {
        const playerMarked = getPickedNumbers(row);
         // check that the numbers the user has picked are in the drawn numbers and the 
         // user has marked all the numbers in the row.
        if (compareArrays(drawnNumbers, playerMarked) && playerMarked.length === row.length) {
            console.log("should have a prize")
            const prize = pickAPrize("winningLine");
            displayPrize(".winning-line-prize", prize);
        };

    })
    toggleAnimation();
}

const setUpEvents = () => {
    $('#start-game').on('click', startTheGame);
    $('#winning-line').on('click', winningLine);
    $("#submit-options").on('click',startTheGame);
}

const playBingo = () => {
    
    try {
        const difficulty = $('input[name=difficulty]:checked').val();
        // setAnimationSpeed(difficulty);
        const numCards = $('#num-cards').val();
        console.log('numCards  :', numCards );
        initialize(numCards);
        setUpEvents();
        gameNumbers = initGameNumbers();

    } catch (error) {
        console.log(error);
    };
    $('#instructions').addClass('hide')
}

