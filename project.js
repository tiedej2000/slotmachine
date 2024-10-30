const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;


// Erstellung eines Objekts: Zuweisung mit einem Schlüssel{A} und einem Wert {2}, ein Objekt ist kein Array!
const symbolsCount = {
    'A': 2,
    'B': 4,
    'C': 6,
    'D': 8
};

const symbolsValues = {
    'A': 5,
    'B': 4,
    'C': 3,
    'D': 2
};

const deposit = () => {
    while (true) {
        const depositAmount = prompt('Enter a deposit amount: ');
        // parseFloat: Umwandlung von Input in eine Gleitpunktzahl
        const numberDepositAmount = parseFloat(depositAmount);
        //NaN: not a number
        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log('Invalid deposit amount, try again!');
        } else {
            return numberDepositAmount;
        }
    }
};

const getNumberOfLines = () => {
    while (true) {
        const lines = prompt('Enter the number of lines to bet on (1-3): ');
        const numberOfLines = parseFloat(lines);

        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log('Invalid number of lines, try again!');
        } else {
            return numberOfLines;
        }
    }
};

const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt('Enter the total bet per line: ');
        const numberBet = parseFloat(bet);

        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
            console.log('Invalid bet, try again!');
        } else {
            return numberBet;
        }
    }
};

const spin = () => {
    const symbols = [];
    // Object.entries(symbolsCount) wandelt das symbolsCount-Objekt in ein Array von Arrays um. 
    //Jedes innere Array enthält ein Schlüssel-Wert-Paar des Objekts: Ausgabe: [['A', 2], ['B', 4], ['C', 6], ['D', 8]]
    for (const [symbol, count] of Object.entries(symbolsCount)) {
        for (let i = 0; i < count; i++) {
            //die push funktion, fügt das jeweilige symbol in das array symbols[]
            symbols.push(symbol);
        }
    }
    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        // ... -> spread Operator: listet Elemente eines Arrays einzeln auf. Es wird eine Kopie von dem Array Symbols erstellet und keine Referenz.
        // -> keine Änderung an dem originalem Array
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            //.lenghh gibt die länge des Arrays zurück 
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            // splice(): entfernt Elemente ab einem bestimmten Index
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
};

const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }

    return rows;
};

const printSlot = (rows) => {
    for(const row of rows){
        let rowString = ''
        for(const [i, symbol] of row.entries()){
            rowString += symbol
            if(i != row.length - 1){
                rowString += ' | '
            }
        }
            console.log(rowString)
    }
}

const getWinnings  = (rows,bet,lines) =>{
    let winnings = 0 
    for(let row = 0; row < lines; row++){
        const symbols = rows[row]
        let allSame = true

        for(const symbol of symbols){
            if(symbol != symbols[0]){
                allSame = false
                break
            }
        }

        if(allSame){
            winnings += bet * symbolsValues[symbols[0]]
        }
    }
    return winnings
}

const game = () =>{
    let balance = deposit();


    while(true){
        console.log('Your balance is: $' + balance)
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines
        const reels = spin();
        const rows = transpose(reels); 
        printSlot(rows)
        const winnings = getWinnings(rows,bet,numberOfLines)
        balance += winnings
        console.log('You won, $'+winnings.toString())

        if(balance == 0){
            console.log('You ran out of money!')
            break;
        }
        const playAgain = prompt('Do you want to pay again (y/n)? ')

        if(playAgain != 'y')
            break;
    }
}

game()

