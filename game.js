// main code for the game



// this array is used to hold a place holder for each of the numbers between 1 and 90 which holds the number and a flag which indicates if this number has already been picked
let bingoNumbers = [];
let playerCard = [];

console.log(playerCard)

// this function initialises our bingoNumbers array by filling it with bingoNumber objects numbered 1 to 90 with a the flag set to false
const initBingoNumbers = () =>{
    let arrayToInitialise = [];

    for (let row = 0; row < 9; row++) {
        let rowNumbers = [];
        for (let col = 0; col < 10; col++ ) {
            let bingoNumber = {               
                value: ((col ) + (row * 10)),
                isPicked: false
            };
            rowNumbers.push(bingoNumber);
        }
        arrayToInitialise.push(rowNumbers);
    }
    return arrayToInitialise;
};

const generateBlanks = (bingoCard) => {
    for ( let indexRow = 0; indexRow < 18; indexRow++){
        let blankCellsCount = 0;
        let bingoRow = [];
        for (let indexCol = 0; indexCol < 9; indexCol++ ){
            
            let isBlank = getRandom(0,2);
            let playerCell = {
                value: 0,
                isBlank: false,
                isMarked:false,
            };

            if(isBlank === 0 && blankCellsCount < 4){
                playerCell.isBlank = true;
                blankCellsCount++;
            }
            bingoRow.push(playerCell);
        }
        //make sure we have 4 blank cells
        if(blankCellsCount < 4) {
            bingoRow.forEach(cell => {
                if(!cell.isBlank && blankCellsCount < 4){
                    cell.isBlank = true;
                    blankCellsCount++;
                }
            })
        }
        bingoCard.push(bingoRow);
    }
}

//Get the column to put the number in 
const getColumnRef =(uniqueNumber, indexCol) => {
    return uniqueNumber - indexCol * 10;
}

const getNotPickedNumbers = (array,index) => {
    const row = index * 10;
    let filteredArray = array[row].filter(cell => cell.isPicked === false);
    console.log('filteredArray :', filteredArray);
    return filteredArray;
}

// generate a random number between min and max
const getRandom =(min, max) => {        
   return parseInt(Math.random() * (max - min) + min);
}

const getUniqueRandom = (indexRow, indexCol) => {
    console.log("TCL: getUniqueRandom -> indexCol", indexCol)
    console.log("TCL: getUniqueRandom -> indexRow", indexRow)

    let uniqueNumber = 0;
    let arrayFiltered = getNotPickedNumbers(bingoNumbers, indexRow);

   

        // uniqueNumber = getRandom(indexCol * 10, (indexCol * 10) + 9);
        
        let indexToUse = getRandom (0, arrayFiltered.length)
       
        //let selectedNumberCol = getColumnRef(uniqueNumber, indexCol);
        uniqueNumber = arrayFiltered[indexToUse];
        
        // console.log("TCL: getUniqueRandom -> bingoNumbers[indexCol][selectedNumberCol].isPicked", bingoNumbers[indexCol][selectedNumberCol].isPicked)
    
        // console.log("TCL: getUniqueRandom -> bingoNumbers[indexCol][uniqueNumber] and uniqueNumber =", bingoNumbers[indexCol][selectedNumberCol],uniqueNumber);

    
    return uniqueNumber;
}



const populateNumbers = (card) => {
    card.forEach((row, indexRow) => {
    console.log('row :', row, indexRow);
        
        row.forEach((cell, indexCol) => {
            if(!cell.isBlank){
                cell.value = getUniqueRandom(indexRow, indexCol);
                console.log('cell.value :', cell.value);
                let selectedNumberCol = getColumnRef(cell.value, indexCol);
                console.log('selectedNumberCol :', selectedNumberCol);

                //bingoNumbers[indexCol][selectedNumberCol].isPicked = true;
            }
            
        })
    })
}



const fillCard = (card) => {

    generateBlanks(card);
    console.log(card)
    populateNumbers(card);
}




// get unique number for the cell that has not been used before
const getNumberForCell = (indexRow, indexCol) => {
    
    let rand = getUniqueRandom(indexRow, indexCol);
    return rand;
};


//
const populateCell = (cell, indexRow, indexCol) => {
    
    let cellNumber = getNumberForCell(indexRow, indexCol);

    cell.innerText = cellNumber;

    // console.log("TCL: populateCell -> cellNumber", cellNumber, indexCol)

    // console.log("TCL: populateCell -> bingoNumbers[cellNumber]", bingoNumbers[cellNumber])
    let selectedNumberCol = getColumnRef(cellNumber, indexCol);
    bingoNumbers[indexCol][selectedNumberCol].isPicked = true;
}

// return all the rows for a player card
// requires a tag to uniquely id the card to
// return rows for
const getRowElements = cardToGet => {
    let rows = $(cardToGet);
    return rows;
};

// purpose of this function is to populate a game card with 90
// numbers 0 -90 across the 27 cells on each card
// takes in a reference to a card
const initCard = (playerCard) => {
    try {
        let rows = getRowElements(playerCard);

        $(rows).each ((indexRow, row) => {  
            if(indexRow <= 8)  {
            $( $(row)[0].children).each((indexCol, cell) => {
                console.log("TCL: initCard -> indexCol", indexCol, indexRow)
                populateCell(cell, indexRow, indexCol);
            })
        }
        })
    
    } catch (error) {
        console.log(error);
    }
}
  



const getRow = (rows, index) => {
    return rows[index];
}

$(document).ready(()=>{
    bingoNumbers = initBingoNumbers();
    console.log("TCL: bingoNumbers", bingoNumbers)

    fillCard(playerCard);

    // initCard("#player-card .card-wrapper .card .row");
    console.log(bingoNumbers)
    //populateCell("cell",1)

})