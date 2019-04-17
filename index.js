
$(document).ready(() => {
    do
	var {firstOperand, operator, secondOperand, answer} = setValues()
    while(operator == "/" && secondOperand == 0);
    $("#submit").click(() => {
	let answerInput = $("#answerInput").val()
	if (answerInput == answer)
	{
	    $("#result").text("Correct")
	    chrome.runtime.sendMessage({message: "unblock"})
	}
	else 
	{
	    $("#result").text("Wrong")
	    $("#answerInput").val("")
	    ({firstOperand, operator, secondOperand, answer} = setValues())
	}
    })
})

function setValues() {
    let firstOperand = generateNumber()
    let secondOperand = generateNumber()
    let operator = generateOperator()

    $("#firstOperand").text(firstOperand.toString())
    $("#secondOperand").text(secondOperand.toString())
    $("#operator").text(operator.toString())

    let answer = generateAnswer(firstOperand, operator, secondOperand)
    return { firstOperand, operator, secondOperand, answer }
}

function generateNumber() 
{
    let num = Math.floor(Math.random() * 100)
    return(num)
}

function generateOperator() 
{
    let odds = Math.random()
    if( odds <= 0.25 ) 
    {
	operator = "+"
    }
    else if ( odds <= 0.5 )
    {
	operator = "-"
    }
    else if ( odds <= 0.75 )
    {
	operator = "*"
    }
    else
    {
	operator = "/"
    }
    return operator;
}

function generateAnswer(firstOperand, operator, secondOperand)
{
    let result;
    if(operator == "+")
    {
	result = firstOperand + secondOperand	
    }
    else if (operator == "-")
    {
	result = firstOperand - secondOperand
    }
    else if (operator == "*")
    {
	result = firstOperand * secondOperand
    }
    else
    {
	result = firstOperand / secondOperand
    }
    return roundToTwo(result);
}

function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}


