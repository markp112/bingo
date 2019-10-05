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

// initialises the players card
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


// for each column in the players card generate numBlanks blank squares
// input: numBlanks - number of blanks to be created
// output: array of numbers between 0 and 18, generated randomly which represent the cells
// on the players card that will be blank
const createBlanks = numBlanks => {
    let blanks = [];
    let isComplete = false;

    while (!isComplete) {
        let random = getRandom(0,18);
        // only add numbers not already in the array
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

// getUnique random number - return a random number between minRange and MaxRange
// that has not inlcuded in the pickedNumbers array
const getUniqueRandomNumber = (pickedNumbers, minRange, maxRange) => {
    
    let rand = getRandom(minRange, maxRange);
    while (pickedNumbers.includes(getRandom(rand))){
        rand = getRandom(minRange, maxRange);
    }
    return rand;
}

// createPlayerNumbers fill the card with numbers and blank cells based on the maximum rows and columns
const createPlayerNumbers = (card, maxRows, maxCols) => {
    let pickedNumbers = [];

    for (let indexCol = 0; indexCol < maxCols; indexCol++){
        // generate the blanks in each column first col has 9 rest have 8
        const blanks = indexCol === 0 ? maxRows : (maxRows - 1);
        const blankCells = createBlanks(blanks);
        
        pickedNumbers = [];
        for (let indexRow = 0; indexRow < maxRows; indexRow++) {
            // if the current cell is defined as blank set flag to true
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
    try {
        createPlayerNumbers(card, rows, columns);
        return true;    
    } catch (error) {
        throw new Error(`Failed to populateNumbers --> ${error}`);
    }
};

const putNumbersOnCard = (playerCard) => {
    
    // get all the cells for the cards that have been put on the screen
    const c2 = document.querySelectorAll('.row .cell');

    let colIndex = 0;
    c2.forEach((cell, index) =>{
        const rowIndex = parseInt(index / 9);
        if(!playerCard[rowIndex][colIndex].isBlank) {
            cell.innerHTML +=(playerCard[rowIndex][colIndex].value);
        } else {
            cell.classList.add("blank-cell");
        }
        const id = `r${rowIndex}c${colIndex}`
        cell.setAttribute("id",id);
        cell.addEventListener('click', () => {markCard(id)});
        if( colIndex < 8)  {colIndex++}  else{ colIndex = 0};
    });
}


// display the players card on the screen:
// first get a reference to the card contained in the html partials folder
// based on the data in the array playerCard transcribe this to the Html card
// inserting the numbber where a number exists and blank where the cell is blank
//
const displayCard = (playerCard, numberOfCards) => {

    const importedCard = document.querySelector('#player-card').import;
    const card = importedCard.querySelector('.bingo-card');
    const insertionPoint = document.querySelector("#game-wrapper");
    
    insertionPoint.appendChild(card);

    putNumbersOnCard(playerCard);
}

const getCellRef = (startChar,endChar, cellRef) => {
    const startPos = cellRef.indexOf(startChar) + 1;
    const endPos = endChar === "" ? cellRef.length : CellRef.indexOf(endChar);
    return cellRef.substring(startPos,endPos);
}

const markCard = (id) => {
    
    if (typeof id === "string") {
        
        const cell = document.querySelector('#' + id + ' span');

        const row = getCellRef('r','c',id);
        const col = getCellRef('c','');
        
        cell.classList.add('circle2')
    }
}
    

    



$(document).ready(() => {
        
    try {  
        bingoNumbers = initBingoNumbers();
        
        let playerCard = initCard();
        
        let numberOfCards = 1;
        let rows = numberOfCards * 3;
        const cols = 9;
        
        // setup the 
        if( fillCard(playerCard, rows, cols)){
            displayCard(playerCard, numberOfCards);
        };
        
        
        } catch (error) {
            console.log(error);
        };
});
