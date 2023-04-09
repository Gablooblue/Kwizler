
$(document).ready(() => {
    main()
})


function generateMathQuestion(difficulty) {
    const operations = ['+', '-', '*', '/'];
    let min, max;

    switch (difficulty) {
        case 'easy':
            min = 1;
            max = 10;
            break;
        case 'medium':
            min = 10;
            max = 50;
            break;
        case 'hard':
            min = 50;
            max = 100;
            break;
        default:
            throw new Error('Invalid difficulty level. Please choose "easy", "medium", or "hard".');
    }

    const firstOperand = Math.floor(Math.random() * (max - min + 1)) + min;
    let secondOperand = Math.floor(Math.random() * (max - min + 1)) + min;
    const operationIndex = Math.floor(Math.random() * operations.length);
    const operation = operations[operationIndex];

    // Ensure the division results in one of the specified decimal points
    if (operation === '/') {
        const possibleFractions = [
            { numerator: 1, denominator: 4 },
            { numerator: 1, denominator: 2 },
            { numerator: 3, denominator: 4 },
            { numerator: 1, denominator: 3 },
            { numerator: 2, denominator: 3 },
            { numerator: 1, denominator: 1 }
        ];
        const selectedFraction = possibleFractions[Math.floor(Math.random() * possibleFractions.length)];
        secondOperand = firstOperand * selectedFraction.denominator / selectedFraction.numerator;
    }



    let answer = calculateAnswer(firstOperand, secondOperand, operation)
    answer = roundToTwo(answer)


    return { firstOperand, operation, secondOperand, answer }
}

function calculateAnswer(num1, num2, operation) {
    switch (operation) {
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '*':
            return num1 * num2;
        case '/':
            return num1 / num2;
        default:
            throw new Error('Invalid operation.');
    }
}

function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}

function getDifficulty() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['difficulty'], ({ difficulty }) => {
            resolve(difficulty);
        });
    });
}

async function main() {
    const difficulty = await getDifficulty();

    var {firstOperand, operation, secondOperand, answer} = generateMathQuestion(difficulty)
    console.table(firstOperand, operation, secondOperand, answer)

    $("#firstOperand").text(firstOperand.toString())
    $("#secondOperand").text(secondOperand.toString())
    $("#operation").text(operation.toString())

    $("#submit").click(() => {
        let answerInput = $("#answerInput").val()
        if (answerInput == answer)
        {
            $("#result").text("Correct")
            $("#instruction").text("Redirecting you now")
            $("#instruction").removeClass("has-text-danger")
            $("#instruction").addClass("has-text-success")
            $("#result").removeClass("has-text-danger")
            $("#result").addClass("has-text-success")
            chrome.runtime.sendMessage({message: "unblock"})
        }
        else 
        {
            $("#result").text("Wrong")
            $("#instruction").text("Try again")
            $("#instruction").removeClass("has-text-success")
            $("#instruction").addClass("has-text-danger")
            $("#result").removeClass("has-text-success")
            $("#result").addClass("has-text-danger")
            $("#answerInput").val("")
            //({firstOperand, operation, secondOperand, answer} = setValues())
        }
    })

}


$("#mathForm").submit(function(e) {
    e.preventDefault();
});
