// main code for the game



// this array is used to hold a place holder for each of the numbers between 1 and 90 which holds the number and a flag which indicates if this number has already been picked
let bingoNumbers = [];

// this function initialises our bingoNumbers array by filling it with bingoNumber objects numbered 1 to 90 with a the flag set to false
// const initBingoNumbers = () =>{
//     bingoNumbers = [];

//     for (let row = 0; row < 9; row++) {
//         let rowNumbers = [];

//         for (let col = 0; col < 9; col++ ) {
//             let colAdjust = col === 0 ? 1 : 1;
//             let bingoNumber = {
                
//                 value: ((col + colAdjust) + (row * 10)),
//                 picked: false
//             };
//             rowNumbers.push(bingoNumber);
//         }
//         bingoNumbers.push(rowNumbers);
//     }
//     console.log(bingoNumbers);
// };

const initBingoNumbers = () => {
    bingoNumbers = [];

    for (let row = 0; row < 90; row++) {
        let bingoNumber = {
            value: row + 1,
            isPicked: false
        };
        
        bingoNumbers.push(bingoNumber);
    }
    console.log(bingoNumbers);
};

// generate a random number between min and max
const getRandom =(min, max) => {
   return parseInt(Math.random() * (max - min) + min);
}

const getUniqueRandom = (min,max) => {
    let isUnique = false;
    let uniqueNumber = -1;
    while (!isUnique){
        uniqueNumber = getRandom(min,max);
        if(!bingoNumbers[uniqueNumber].isPicked) isUnique = true;
    }
    return uniqueNumber;
}


// fills a row with a combination of numbers and blank spaces
// takes in a parameter of row
const populateRow = (row) => {
    
    for (let col = 0; col < 9; col++){
        // each column will have a number as follows
        // col1 1-9, col2 10-19, col3 20-29 etc
        let rand = getUniqueRandom((col * 10) + 1, (col * 10) + 9);

        let colElement = row.children[col];

        console.log(colElement)
       


    }


}

// purpose of this function is to populate a game card with 90
// numbers 0 -90 across the 27 cells on each card
// takes in a reference to a card
const initCard = (playerCard) => {
    let rows = getRowElements(playerCard);
    
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        let row = rows[rowIndex];
        populateRow(row);
    }
}

// return all the rows for a player card
// requires a tag to uniquely id the card to
// return rows for
const getRowElements = cardToGet => {
    let rows = $(cardToGet);
    return rows;
};

const getRow = (rows, index) => {
    return rows[index];
}

$(document).ready(()=>{
    initBingoNumbers();
    initCard("#player-card .card-wrapper .card .row");

})