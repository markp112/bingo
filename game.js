// main code for the game

// this array is used to hold a place holder for each of the numbers between 1 and 90 which holds the number and a flag which indicates if this number has already been picked
let bingoNumbers = [];


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
};


// for each row in the players card generate 4 blank squares
const createBlanks = numBlanks => {
    let blanks = [];
    let isComplete = false;

    while (!isComplete) {
        let random = getRandom(0,18);
        if(!blanks.includes(random)) blanks.push(random);
        if(blanks.length === numBlanks) isComplete = true;
    }
    return blanks;
};

// using the unique number and the index of column return the 
// reference back to the actual cell in bingoNumbers matrix
const getColumnRef = (uniqueNumber, indexCol) => {
    return uniqueNumber - indexCol * 10;
};

// filter an array of Bingo Numbers for those that have not been picked 
const getNotPickedNumbers = (array, index) => {
    let filteredArray = array[index].filter(cell => cell.isPicked === false);
    console.log("filteredArray :", filteredArray);
    return filteredArray;
};



// Return a unique randomm number based on the available numbers
// from the current row matrix of bingo numbers
// const getUniqueRandom = (indexRow, indexCol) => {
//     let uniqueNumber = 0;
//     // filter the array for only non picked values
//     let arrayFiltered = getNotPickedNumbers(bingoNumbers, indexCol);
//     // randomise the index to select the value from the row of numbers in the filtered array
//     let indexToUse = getRandom(0, arrayFiltered.length);
//     // index to use corresponds to a random number between 1 and 9 which is used to select the number from the current row
//     // the number should be unique as the array is filtered on non picked numbers
//     uniqueNumber = arrayFiltered[indexToUse].value;
//     return uniqueNumber;
// };

const getUniqueRandomNumber = (pickedNumbers, minRange, maxRange) => {
    
    let rand = getRandom(minRange, maxRange);
    while (pickedNumbers.includes(getRandom(rand))){
        rand = getRandom(minRange, maxRange);
    }
    return rand;
}

const populateNumbers = (card, maxRows, maxCols) => {
    let selectedNumberCol;
    let pickedNumbers = [];

    for (let indexCol = 0; indexCol < maxCols; indexCol++){
          // generate the blanks in each column first col has 9 rest have 8
        let blanks = indexCol === 0 ? 9 : 8;
        let blankCells = createBlanks(blanks);
        console.log("TCL: populateNumbers -> blankCells", blankCells)
        pickedNumbers = [];
        for (let indexRow = 0; indexRow < maxRows; indexRow++) {
            // check if cell is defined as blank
            if (blankCells.includes(indexRow)) {
                
                card[indexRow][indexCol].isBlank = true;
            }else {
                // get a unique random number.... To do...
                // for column 0 numbers 0-9 for column 2 10-19 etc
                // therefore: for col ===0 col * 10 = 0 and col * 10 + 9 = 9
                let rand = getUniqueRandomNumber(pickedNumbers,(indexCol * 10),(indexCol * 10 + 9));
                pickedNumbers.push(rand);
                card[indexRow][indexCol].value = rand;
                card[indexRow][indexCol].isBlank = false;
                
            }
        }
    }    
};

const fillCard = (card, rows, columns) => {
    populateNumbers(card, rows, columns);
    console.log("TCL: card", card)
    
};

// // get unique number for the cell that has not been used before
// const getNumberForCell = (indexRow, indexCol) => {
//     let rand = getUniqueRandom(indexRow, indexCol);
//     return rand;
// };

//
const populateCell = (cell, indexRow, indexCol) => {
    let cellNumber = getNumberForCell(indexRow, indexCol);

    cell.innerText = cellNumber;

    // console.log("TCL: populateCell -> cellNumber", cellNumber, indexCol)

    // console.log("TCL: populateCell -> bingoNumbers[cellNumber]", bingoNumbers[cellNumber])
    let selectedNumberCol = getColumnRef(cellNumber, indexCol);

    bingoNumbers[indexCol][selectedNumberCol].isPicked = true;
};

// return all the rows for a player card
// requires a tag to uniquely id the card to
// return rows for
const getRowElements = cardToGet => {
    let rows = $(cardToGet);
    return rows;
};



const getRow = (rows, index) => {
    return rows[index];
};

$(document).ready(() => {
    bingoNumbers = initBingoNumbers();
    console.log("TCL: bingoNumbers", bingoNumbers);
    let playerCard = initCard();
    let rows = 19;
    let cols = 10;
    // setup the 
    fillCard(playerCard, rows, cols);

    
});
