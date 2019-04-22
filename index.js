
$(document).ready(() => {
    do
	var {firstOperand, operator, secondOperand, answer} = setValues()
    while(operator == "/" && secondOperand == 0);
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
        //({firstOperand, operator, secondOperand, answer} = setValues())
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
    let num = Math.floor(Math.random() * 100) + 1
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


$("#mathForm").submit(function(e) {
    e.preventDefault();
});
