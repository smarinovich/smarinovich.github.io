/*
Made by Sam Marinovich 2021, 
Javascript component of Pseudocode Interpreter

Predefined Global Variables 
- varArray contains all array
- userCode contains all the original code
- errorNum identifies if an Error has occurred and what it is
- errorMsgSent identifies if the user has received an error message for their current code
- Error line shows the line the error occurred on
- allOutput creates a collection of all the messages that have been alerted to user
- Date is used on downloads
- versionCounter shows what version of the code is being downloaded (versions number increase with each download)
*/

"use strict";

var index;
var varArray = [];
var userCode;
var errorNum = 0;
var errorMsgSent = false;
var errorLine = '';
var allOutput = [];
const currentDate = new Date();
var versionCounter = 1;

function varReturn(name) {
    //Will search through all the variable values that the user has created, see if the request one exists.
    //Returns the index position of the request variable, or -1 if that var doesn't exist
    var value = -1;
    for (var varIndex = 0; varIndex < varArray.length; varIndex++) {
        if (name == varArray[varIndex].name) {
            value = varIndex;
            break;
        }
    }
    return value;
}

function varType(varContent) {
    //will identify the data type of the inputted value, and identify it as either string or integer
    //possibleIntValues is a list of all the possible characters in an integer
    var possibleIntValues = ['-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var possibleInt = true;
    for (var varIndex = 0; varIndex < varContent.length; varIndex++) {
        if (possibleIntValues.includes(varContent[varIndex]) == false) {
            possibleInt = false;
            break;
        }
    }
    if (possibleInt == false) {
        return 'string';
    } else {
        return 'integer';
    }
}

function arithmeticLogic(outputStatement, outputType, returnedOutput) {
    // Will preform arithmetic functions, like adding, minus, times, division or raising to a power (returnedOutput being the result)
    // Does different things, depending on the 2 data types (integers can have all functions on them, while strings can only times or add)
    var arithmeticOPS = ['+', '-', '*', '\\', '^'];
    var secondType = '';
    var secondValue;
    if (varReturn(outputStatement[1]) > -1) {
        secondType = varArray[varReturn(outputStatement[1])].type;
        secondValue = varArray[varReturn(outputStatement[1])].contents;
    } else {
        secondType = varType(outputStatement[1]);
        if (secondType = 'string') {
            secondValue = outputStatement[1].substring(1, outputStatement[1].length - 1);
        } else if (secondType = 'integer') {
            secondValue = parseInt(outputStatement[1]);
        }
    }
    if (outputType == 'string' && (outputStatement[0] == '+' || outputStatement[0] == '*')) {
        if (outputStatement[0] == '+') {
            if (secondType == 'string') {
                returnedOutput = returnedOutput + secondValue;
            } else if (secondType == 'integer') {
                returnedOutput = returnedOutput + secondValue;
            }
        } else if (outputStatement[0] == '*') {
            if (secondType == 'integer') {
                returnedOutput = returnedOutput.repeat(parseInt(secondValue));
            } else {
                //string * string does not work
                errorNum = 1;
            }
        }
    } else if (outputType == 'integer' && arithmeticOPS.includes(outputStatement[0]) == true && secondType == 'integer') {
        // Int manipulation
        switch (outputStatement[0]) {
            case '+':
                returnedOutput = returnedOutput + secondValue;
                break;
            case '-':
                returnedOutput = returnedOutput - secondValue;
                break;
            case '*':
                returnedOutput = returnedOutput * secondValue;
                break;
            case '^':
                returnedOutput = returnedOutput ** secondValue;
                break;
            case '\\':
                if (secondValue == '0') {
                    errorNum = 2;
                } else {
                    returnedOutput = parseFloat(returnedOutput);
                    returnedOutput = Math.round(parseFloat(returnedOutput) / parseFloat(secondValue));
                }
                break;
        }
    } else if (outputType == 'integer' && (outputStatement[0] == '+' || outputStatement[0] == '*') && secondType == 'string') {
        // if it is int * | + string, as first if statement is setup for string first
        if (outputStatement[0] == '+') {
            returnedOutput = returnedOutput + secondValue;
        } else if (outputStatement[0] == '*') {
            returnedOutput = secondValue.repeat(parseInt(returnedOutput));
        }
    } else {
        errorNum = 1;
    }
    return returnedOutput;
}

function valueID(queryValue) {
    // Will turn the value into its true form (string numbers to numbers, strings with 'a' to a, replace vars with values)
    var possibleError = false;
    var currentValue;
    var currentValueType;
    if ((queryValue[0] == "'" && queryValue[queryValue.length - 1] == "'") || (queryValue[0] == '"' && queryValue[queryValue.length - 1] == '"')) {
        currentValue = queryValue.substring(1, queryValue.length - 1);
        currentValueType = 'string';
    } else if (varType(queryValue) == 'integer') {
        currentValue = Number(queryValue);
        currentValueType = 'integer';
    } else if (varReturn(queryValue) != -1) {
        currentValue = varArray[varReturn(queryValue)].contents;
        currentValueType = varArray[varReturn(queryValue)].type;
    } else {
        possibleError = true;
    }
    // On the return of this function, the code receives an array with a result or error, which must have a set interface after calling this function
    if (possibleError == true) {
        return ['Error', 3];
    } else {
        return [currentValue, currentValueType]
    }

}

function booleanComparison(factor1, operator, factor2) {
    // Will compare 2 values, according to the operator. Acts usually as a statement in IF, or WHILE, or similar
    var output = false;
    var factor1Type = '';
    var factor2Type = '';
    var possibleError = false;
    var returnArray = [];
    returnArray = valueID(factor1);
    if (returnArray[0] == 'Error') {
        possibleError = true;
        errorNum = returnArray[1];
    } else {
        factor1 = returnArray[0];
        factor1Type = returnArray[1];
    }
    returnArray = [];
    returnArray = valueID(factor2);
    if (returnArray[0] == 'Error') {
        possibleError = true;
        errorNum = returnArray[1];
    } else {
        factor2 = returnArray[0];
        factor2Type = returnArray[1];
    }
    if ((possibleError == false) && (factor1Type == factor2Type)) {
        // Will only compare if they are the same variable types
        if (factor1Type == 'integer') {
            // Int comparison
            switch (operator) {
                case '==':
                    if (factor1 == factor2) {
                        output = true;
                    }
                    break;
                case '!=':
                    if (factor1 != factor2) {
                        output = true;
                    }
                    break;
                case '>=':
                    if (factor1 >= factor2) {
                        output = true;
                    }
                    break;
                case '>':
                    if (factor1 > factor2) {
                        output = true;
                    }
                    break;
                case '<=':
                    if (factor1 <= factor2) {
                        output = true;
                    }
                    break;
                case '<':
                    if (factor1 < factor2) {
                        output = true;
                    }
                    break;
                default:
                    errorNum = 4;
                    possibleError = true;
                    break;
            }
        } else if (factor1Type == 'string') {
            switch (operator) {
                // String Comparison
                case '==':
                    if (factor1 == factor2) {
                        output = true;
                    }
                    break;
                case '!=':
                    if (factor1 != factor2) {
                        output = true;
                    }
                    break;
                default:
                    errorNum = 4;
                    possibleError = true;
                    break;
            }
        }
    } else if (factor1Type != factor2Type) {
        switch (operator) {
            case '==':
                if (factor1 == factor2) {
                    output = true;
                }
                break;
            case '!=':
                if (factor1 != factor2) {
                    output = true;
                }
                break;
            default:
                possibleError = true;
        }
    }
    // Function either returns the boolean output, or Error, if an Error occurred
    if (possibleError == true) {
        return 'Error';
    } else {
        return output;
    }

}

function errorType(number) {
    // Will identify the error that has occurred within the program, and return the message to the user
    var errorMsg;
    switch (number) {
        case 1:
            errorMsg = 'Type Error - Invalid Data Type manipulation';
            // e.g. string - string
            break;

        case 2:
            errorMsg = "Math Error - Can't divide by 0";
            break;

        case 3:
            errorMsg = 'Unknown Value - Did Not enter a known value for an Int, String or Variable';
            // Doesn't know what value was inputted, or written
            break;

        case 4:
            errorMsg = 'Unknown Operator - Operator enter was not a known value';
            // Only accepts 6 ops, (==, !=, <, <=, >, >= for int or == and != for strings)
            break;

        case 5:
            errorMsg = 'Syntax Error - Missing Keywords';
            break;

        case 6:
            errorMsg = 'Type Error - Invalid comparison statement';
            // The comparison can't occur between those 2 values (e.g. 'word' == 4512)
            break;

        case 7:
            errorMsg = 'Syntax Error - Unknown Keywords or phrases';
            break;

    }
    return errorMsg;
}

function runCode(inputCode) {
    // for the length of inputted code, this will search through the first word of each line
    for (index = 0; index < inputCode.length; index++) {
        switch (inputCode[index][0]) {
            case 'input':
                //User wants to input a variable
                var userInput = prompt(`Enter a value for ${inputCode[index][1]}`);
                if (varType(userInput) == 'integer') {
                    userInput = Number(userInput);
                } else if (varType(userInput) == 'string') {
                    userInput = userInput.substring(1, userInput.length - 1);
                }
                var tempRecord = {
                    name: inputCode[index][1],
                    contents: userInput,
                    type: varType(userInput)
                }
                // Looks if the variable exists, and will update it, otherwise creates a new variable
                if (varReturn(tempRecord.name) != -1) {
                    varArray[varReturn(tempRecord.name)] = tempRecord;
                } else {
                    varArray.push(tempRecord);
                }
                break;

            case 'output':
                // User wants to output a value
                // First the code recalls the value (in string or int form in js)
                var outputTotal, outputType;
                var returnArray;
                returnArray = valueID(inputCode[index][1]);
                if (returnArray[0] == 'Error') {
                    errorNum = returnArray[1];
                    errorLine = inputCode[index];
                    break;
                } else {
                    outputTotal = returnArray[0];
                    outputType = returnArray[1];
                }
                // If a second value exists (e.g + 3), the code will then modify the output
                if (inputCode[index][2] != undefined) {
                    outputTotal = arithmeticLogic(inputCode[index].slice(2, 4), outputType, outputTotal);
                }
                // If an error has been raised, it will not output the value
                if (errorNum == 0) {
                    alert(outputTotal);
                    allOutput.push(outputTotal);
                } else {
                    errorLine = inputCode[index];
                }
                break;

            case 'IF':
                if (inputCode[index][inputCode[index].length - 1] == 'THEN') {
                    // Locate the ENDIF
                    var endPos = 0;
                    var varIndex = 0;
                    while (endPos == 0 && (varIndex < inputCode.length)) {
                        if (inputCode[index + varIndex][0] == 'ENDIF') {
                            endPos = index + varIndex;
                            break;
                        }
                        varIndex++;
                    }
                    if (endPos > index) {
                        // Check if there is an else condition
                        var elsePos = 0;
                        for (varIndex = index; varIndex < endPos; varIndex++) {
                            if (inputCode[varIndex][0] == 'ELSE') {
                                elsePos = varIndex;
                                break;
                            }
                            varIndex++;
                        }
                        // Check for And/or
                        var andOrCase = '';
                        for (varIndex = 0; varIndex < inputCode[index].length; varIndex++) {
                            if (inputCode[index][varIndex] == 'AND' || inputCode[index][varIndex] == 'OR') {
                                andOrCase = inputCode[index][varIndex];
                                break;
                            }
                        }
                        var output = booleanComparison(inputCode[index][1], inputCode[index][2], inputCode[index][3]);
                        if (output != 'Error') {
                            if (andOrCase != '') {// If there is an And or OR
                                var tempOutput = booleanComparison(inputCode[index][5], inputCode[index][6], inputCode[index][7])
                                if (tempOutput != 'Error') {
                                    // Will complete the logic, with and/or
                                    if (andOrCase == 'AND') {
                                        output = output && tempOutput;
                                    } else {
                                        output = output || tempOutput;
                                    }
                                    if (elsePos != 0) {
                                        //If there is else
                                        if (output == true) {
                                            //Run code until before the Else
                                            var userCodeSection = inputCode.slice(index + 1, elsePos);
                                            runCode(userCodeSection);
                                        } else {
                                            // Will run the Else section
                                            var userCodeSection = inputCode.slice(elsePos + 1, endPos);
                                            runCode(userCodeSection);
                                        }
                                    } else {
                                        if (output == true) {
                                            //Running the code if there is no else section
                                            var userCodeSection = inputCode.slice(index + 1, endPos);
                                            runCode(userCodeSection);
                                        }
                                    }
                                } else {
                                    // If the second statement has an error within
                                    errorNum = 6;
                                    errorLine = inputCode[index];
                                }
                            } else {
                                // Will run through the if else logic, if there isn't an And or Or
                                if (elsePos != 0) {
                                    // Running code if there is Else
                                    if (output == true) {
                                        //If condition
                                        var userCodeSection = inputCode.slice(index + 1, elsePos);
                                        runCode(userCodeSection);
                                    } else {
                                        // Running through the else condition 
                                        var userCodeSection = inputCode.slice(elsePos + 1, endPos);
                                        runCode(userCodeSection);

                                    }
                                } else {
                                    // If logic, without else 
                                    if (output == true) {
                                        var userCodeSection = inputCode.slice(index + 1, endPos);
                                        runCode(userCodeSection);
                                    }
                                }
                            }
                        } else {
                            // If the output logic is incorrect (Values can't be compared)
                            errorNum = 6;
                            errorLine = inputCode[index];
                        }
                    } else {
                        // If there is no ENDIF in the if Statement, an error will occur
                        errorNum = 5;
                        errorLine = inputCode[index];
                    }
                } else {
                    // If there is no THEN in the if Statement, an error will occur
                    errorNum = 5;
                    errorLine = inputCode[index];
                }
                index = endPos;
                break;

            case 'WHILE':
                // Similar code to the IF statement, as the program tries to identify ENDWHILE
                var endPos = 0;
                var varIndex = 0;
                while (endPos == 0 && (varIndex < inputCode.length)) {
                    if (inputCode[index + varIndex][0] == 'ENDWHILE') {
                        endPos = index + varIndex;
                    }
                    varIndex++;
                }
                if (endPos > index) {
                    // Loop only runs if the ENDWHILE is at least a line away from the WHILE statement
                    if (booleanComparison(inputCode[index][1], inputCode[index][2], inputCode[index][3]) != 'Error') {
                        // Saves all the values (like the code, and comparison factors, so that they don't get updated by accident )
                        var userCodeSection = inputCode.slice(index + 1, endPos);
                        var factor1 = inputCode[index][1];
                        var operator = inputCode[index][2];
                        var factor2 = inputCode[index][3];
                        while (booleanComparison(factor1, operator, factor2)) {
                            runCode(userCodeSection);
                            if (errorNum != 0) {
                                // If an error occurs, the loop breaks to hit error exception
                                // errorLine does not need to update, as it should be updated inside the loop
                                break;
                            }
                        }
                    } else {
                        // If the comparison is invalid
                        errorNum = 6;
                        errorLine = inputCode[index];
                    }
                } else {
                    // If the ENDWHILE is missing
                    errorNum = 5;
                    errorLine = inputCode[index];
                }
                // Skip the position of ENDWHILE
                index = endPos;
                break;

            case 'REPEAT':
                var endPos = 0;
                var varIndex = 0;
                while (endPos == 0 && (varIndex < inputCode.length)) {
                    if (inputCode[index + varIndex][0] == 'UNTIL') {
                        endPos = index + varIndex;
                    }
                    varIndex++;
                }
                if (endPos > index) {
                    // Loop only runs if the UNTIL is at least a line away from the REPEAT statement
                    if (booleanComparison(inputCode[endPos][1], inputCode[endPos][2], inputCode[endPos][3]) != 'Error') {
                        // Saves all the values (like the code, and comparison factors, so that they don't get updated by accident )
                        var userCodeSection = inputCode.slice(index + 1, endPos);
                        var factor1 = inputCode[endPos][1];
                        var operator = inputCode[endPos][2];
                        var factor2 = inputCode[endPos][3];
                        do {
                            runCode(userCodeSection);
                            if (errorNum != 0) {
                                // If an error occurs, the loop breaks to hit error exception
                                // Error line is updated inside the loop
                                break;
                            }
                        } while (!(booleanComparison(factor1, operator, factor2)));
                    } else {
                        // If the comparisons is invalid
                        errorNum = 6;
                        errorLine = inputCode[index];
                    }
                } else {
                    // If the UNTIL is missing
                    errorNum = 5;
                    errorLine = inputCode[index];
                }
                // Skip the position of UNTIL
                index = endPos;
                break;

            case 'FOR':
                var nextPos = 0;
                var varIndex = 0;
                while (nextPos == 0 && (varIndex < inputCode.length)) {
                    // Locate the next position in the loop
                    if (inputCode[index + varIndex][0] == 'NEXT') {
                        nextPos = index + varIndex;
                    }
                    varIndex++;
                }
                if (nextPos > index) {
                    if (inputCode[index][2] == '=' && inputCode[index][4] == 'TO' && inputCode[index][6] == 'STEP' && inputCode[index][1] == inputCode[nextPos][1]) {
                        // Checks if the 3rd value is =, 5th value is to, 7th value is step, and the declared variable is the same
                        // Check if the variable range is correct
                        var stepIncrease = parseInt(inputCode[index][7]);
                        var endValue = parseInt(inputCode[index][5]);
                        var increaseValue = inputCode[index][1];
                        // adds the increase value as a variable
                        var tempRecord = {
                            name: increaseValue,
                            contents: parseInt(inputCode[index][3]),
                            type: 'integer'
                        }
                        var comparison = false;
                        var compMethod = '';
                        varArray.push(tempRecord);
                        // identify what the change is, and what the boolean comparison should be
                        if (stepIncrease > 0) {
                            if (endValue > varArray[varReturn(increaseValue)].contents) {
                                comparison = true;
                                compMethod = '<=';
                            }
                        } else if (stepIncrease < 0) {
                            if (endValue < varArray[varReturn(increaseValue)].contents) {
                                comparison = true;
                                compMethod = '>=';
                            }
                        }
                        if (comparison) {
                            var userCodeSection = inputCode.slice(index + 1, nextPos);
                            while (booleanComparison(increaseValue, compMethod, endValue)) {
                                runCode(userCodeSection);
                                if (errorNum != 0) {
                                    break;
                                }
                                // Manually go in and increase the variable result
                                varArray[varReturn(increaseValue)].contents = varArray[varReturn(increaseValue)].contents + stepIncrease;
                            }
                        } else {
                            errorNum = 6;
                            errorLine = inputCode[index];
                        }
                        varArray.splice(varReturn(increaseValue), 1);
                    } else {
                        // Missing keywords
                        errorNum = 5;
                        errorLine = inputCode[index];
                    }
                } else {
                    // If the NEXT is missing
                    errorNum = 5;
                    errorLine = inputCode[index]
                }
                // Skip the position of NEXT
                index = nextPos;
                break;

            case 'CASEWHERE':
                var endPos = 0;
                var varIndex = 0;
                while (endPos == 0 && (varIndex < inputCode.length)) {
                    // Locate the ENDCASE position 
                    if (inputCode[index + varIndex][0] == 'ENDCASE') {
                        endPos = index + varIndex;
                    }
                    varIndex++;
                }
                if (endPos > index) {
                    var defaultCase = false;
                    var caseCount = 0;
                    for (varIndex = index; varIndex < endPos - 1; varIndex++) {
                        // Looking for amount of cases in the CASEWHERE, and if an other case exists
                        if (inputCode[index + varIndex][0] == 'OTHERWISE:') {
                            defaultCase = true;
                        } else if (inputCode[index + varIndex][0][inputCode[index + varIndex][0].length - 1] == ':') {
                            caseCount++;
                        } else {
                            // If a Case doesn't exist on a line, it will become a big negative number, which forces the next selection to go to false
                            caseCount = -10 * inputCode.length;
                        }
                    }
                    if (caseCount > 0) {
                        // Saving the 2 values, in case the code gets updated
                        var factor1 = inputCode[index][1];
                        var operator = inputCode[index][2];
                        // failedCase will turn to false if a case has occurred, meaning it won't go to default
                        var failedCase = true;
                        for (varIndex = 1; varIndex <= caseCount; varIndex++) {
                            if (booleanComparison(factor1, operator, inputCode[index + varIndex][0].slice(0, -1)) == true) {
                                var userCodeSection = [inputCode[index + varIndex].slice(1, inputCode[index + varIndex].length)];
                                runCode(userCodeSection);
                                failedCase = false;
                                break;
                            } else if (booleanComparison(factor1, operator, inputCode[index + varIndex][0].slice(0, -1)) == 'Error') {
                                // Invalid Comparison
                                errorNum = 6;
                                errorLine = inputCode[index];
                                failedCase = false;
                                break;
                            }
                        }
                        if (defaultCase && failedCase) {
                            // Checks if both a Default case exists, and if any other case has been used
                            if (inputCode[endPos - 1][0] == 'OTHERWISE:') {
                                var userCodeSection = [inputCode[endPos - 1].slice(1, inputCode[endPos - 1].length)];
                                runCode(userCodeSection);
                            } else {
                                // Otherwise (default case) isn't at the end of the casewhere
                                errorNum = 5;
                                errorLine = inputCode[index];
                            }
                        }
                    } else {
                        // Missing Cases or Otherwise (default case) is in the wrong place
                        errorNum = 5;
                        errorLine = inputCode[index];
                    }
                } else {
                    // if the ENDCASE is missing
                    errorNum = 5;
                    errorLine = inputCode[index];
                }
                index = endPos;
                break;
            
            default:
                if (inputCode[index][1] == '=') {
                    // Variable Assignment e.g x = 2
                    // Reusing the output code, but shift all the index values
                    var outputTotal, outputType;
                    var returnArray;
                    returnArray = valueID(inputCode[index][2]);
                    if (returnArray[0] == 'Error') {
                        errorNum = returnArray[1];
                        errorLine = inputCode[index];
                        break;
                    } else {
                        outputTotal = returnArray[0];
                        outputType = returnArray[1];
                    }
                    if (inputCode[index][3] != undefined) {
                        outputTotal = arithmeticLogic(inputCode[index].slice(3, 5), outputType, outputTotal);
                    }
                    // Reusing the bit of code from input for assignment
                    if (errorNum == 0) {
                        // Will only run if an error wasn't raised when identification of the variable
                        var tempRecord = {
                            name: inputCode[index][0],
                            contents: outputTotal,
                            type: varType(outputTotal)
                        }
                        if (varReturn(tempRecord.name) != -1) {
                            varArray[varReturn(tempRecord.name)] = tempRecord;
                        } else {
                            varArray.push(tempRecord);
                        }
                    } else {
                        errorLine = inputCode[index];
                    }
                } else {
                    // if the word is the line is unknown, it will hit this error
                    errorNum = 7;
                    errorLine = inputCode[index];
                }
        }
        if (errorNum != 0) {
            // If an error has occurred, the code will break its loop
            if (errorMsgSent == false) {
                // if the error message has been sent, this means it doesn't get sent twice.
                output = errorType(errorNum);
                // Will generate Error Message, if the interpreter knows the location, and the message was raised in the mainline
                if (errorLine != '') {
                    errorLine = errorLine.join(' ');
                    output = output + `.\n This occurred on line '${errorLine}'`;
                }
                alert(output);
                allOutput.push(output);
                errorMsgSent = true;
            }
            break;
        }
    }
}

$("#runCode").on("click", function () {
    // Resetting the variables and error contents (all the globals variables)
    varArray = [];
    errorNum = 0;
    errorMsgSent = false;
    allOutput = [];
    $("#outputSection").html('');
    errorLine = '';
    //User code is saved into a 2D array 
    userCode = $("#userCode").val();
    userCode = userCode.split('\n');
    // The code is splitting each line by word spacing, and each individual words
    userCode = userCode.map((value) => value.split(' '));
    if (userCode[0][0] == "BEGIN" && userCode[userCode.length - 1][0] == "END") {
        for (index = 0; index < userCode.length; index++) {
            for (var varIndex = 0; varIndex < userCode[index].length; varIndex++) {
                userCode[index][varIndex] = userCode[index][varIndex].replace(/_/g, ' ');
            }
        }
        var inputCode = userCode;
        // Takes away first and last line of code ('BEGIN' and 'END')
        inputCode.shift();
        inputCode.pop();
        runCode(inputCode);
    } else {
        alert("Invalid syntax - Missing BEGIN or END statement");
        allOutput.push("Invalid syntax - Missing BEGIN or END statement");
    }
    // All the output values that have been saved are being displayed near the bottom of the screen in an output box
    for (var index = 0; index < allOutput.length; index++) {
        $("#outputSection").html($("#outputSection").html() + allOutput[index] + '<br>');
    }
});

// Download function created by Carlos Delgardo (accessible via https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server)
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function createAlert(type, stage) {
    // Creates a Jquery Alert at the top of page to tell the user the status of the file download
    var element = document.createElement('div');
    element.setAttribute('class', `alert alert-${type} alert-dismissible`);
    if (type == 'warning') {
        var alertHTML = `<button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Warning!</strong> You can't proceed with this function, as you are missing the ${stage} `;
    } else {
        if (stage == 'output') {
            stage = ' and Output';
        } else {
            stage = '';
        }
        var alertHTML = `<button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Success!</strong> You have downloaded your Code${stage}!`;
    }
    element.innerHTML = alertHTML;
    $('body').prepend(element);
}

$("#download").on("click", function () {
    //When the Download button is pressed, it will blur the background, and make the popup active
    $('.container-fluid').addClass('active');
    $('#downloadMenu').addClass('active');
});

function closePopup() {
    // Change the back to original screen, by removing the active classes
    $('#downloadMenu').removeClass('active');
    $('.container-fluid').removeClass('active');
}

$("#cancel").on('click', function () {
    // Cancel button will just close the popup:
    closePopup();
});

$("#codeDownload").on('click', function () {
    // Download's just code
    // Check's if there is code, then format it into the txt document, and download
    if ($("#userCode").val() != '') {
        var downloadContent = `Created on: ${currentDate.toDateString()}\nCODE:\n` + $("#userCode").val();
        download(`${currentDate.toISOString().slice(0, 10)}PseudoCode_Ver${versionCounter}.txt`, downloadContent);
        versionCounter++;
        createAlert('success', 'output');
    } else {
        createAlert('warning', 'code');
    }
    closePopup();
});

$("#allDownload").on('click', function () {
    // Downloads both code and output
    // Check if both code and output exist, then format's it into a txt document and downloads
    if (($("#userCode").val() != '') && ($("#outputSection").html() != '')) {
        var downloadContent = `Created on: ${currentDate.toDateString()}\n\nCODE:\n` + $("#userCode").val() + '\n\nOUTPUT:\n' + $("#outputSection").html();
        // Removes all the <br> tags and replaces it with \n for newline
        downloadContent = downloadContent.replace(/<br>/g, '\n');
        download(`${currentDate.toISOString().slice(0, 10)}PseudoCode_Ver${versionCounter}.txt`, downloadContent);
        versionCounter++;
        createAlert('success', 'output');
    } else {
        createAlert('warning', 'output');
    }
    closePopup();
});