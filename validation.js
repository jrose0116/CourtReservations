import { ObjectId } from "mongodb";

const validId = (id, varName) => {
	/*
  Validates and trims an id.

  id = Variable
  varName = String (variable name)
  
  Returns String
  */
	let idName = varName || "id variable";
	if (!id) throw `Error: ${idName} not provided.`;
	if (typeof id !== "string" || id.trim().length === 0)
		throw `Error: ${idName} must be a non-empty string.`;
	id = id.trim();
	if (!ObjectId.isValid(id)) throw `Error: ${idName} is not a valid ObjectId`;
	return id;
};

const validStr = (str, varName) => {
	/* 
  Validates and trims a string.

  str = Variable
  varName = String (variable name)
  
  Returns String
  */
	let strName = varName || "String variable";
	if (!str) throw `Error: ${strName} not provided`;
	if (typeof str !== "string" || str.trim().length === 0)
		throw `Error: ${strName} must be a non-empty string.`;
	str = str.trim();
	return str;
};

const validStrArr = (arr, varName) => {
	/* 
  Validates a string array and trims each element.

  arr = Variable
  varName = String (variable name)
  
  Returns Array of Strings
  */
	let arrName = varName || "String array";
	if (!arrName) throw `Error: ${arrName} not provided`;
	if (!Array.isArray) throw `Error: ${arrName} must be an array`;
	for (let elem of arr) {
		if (typeof elem !== "string" || elem.trim().length === 0)
			throw `Error: ${arrName} must contain only non-empty string elements`;
		elem = elem.trim();
	}
	return arr;
};

const validNumber = (num, varName, isInteger, rangeLow, rangeHigh) => {
	/* 
  Validates a number and returns it.

  num = Variable
  varName = String (variable name)
  isInteger = Boolean
  rangeLow = Number
  rangeHigh = Number

  Returns Number
  */
	let numName = varName || "Number variable";
	if (num === undefined) throw `Error: ${numName} not provided`;
	if (
		typeof num !== "number" ||
		isNaN(num) ||
		num == Infinity ||
		num == -Infinity
	)
		throw `Error: ${numName} must be a real number`;
	if (isInteger && Math.floor(num) != num)
		throw `Error: ${numName} must be a whole number`;
	if (rangeLow !== undefined) {
		if (num < rangeLow)
			throw `Error: ${numName} must be greater than ${rangeLow}.`;
	}
	if (rangeHigh !== undefined) {
		if (num > rangeHigh)
			throw `Error: ${numName} must be less than ${rangeHigh}.`;
	}
	return num;
};

const validAddress = (address) => {

};

const validState = (state) => {
	/*
	Validates a 2 letter state abbreviation and returns it trimmed.
	*/
	state = validStr(state, "State"); 	//check and trim string
	if (state.length != 2) {
		throw `Error: State must be its 2 letter abbreviation.`
	}
	state = state.toUpperCase();

	let states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
				'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']
	if (!states.includes(state)) {
		throw `Error: State must be valid state.`
	}
	return state;
};

const validZip = (zip) => {

};

const validTime = (time, isClosingTime) => {
	/*
	(string, boolean)
	Verifies the time is a string in HH:MM format (military time)
	isClosingTime boolean -> 24:00 is only valid if it is a closing time
	*/
	time = validStr(time, "time");
	let timeArr = time.split(":");

	if (timeArr.length !== 2)
    {
        throw `Error: ${time} has incorrect number of :'s in ${time}`;
    }
	if (timeArr[0].length !== 2)
    {
        throw `Error: ${timeArr[0]} hour string has length ${timeArr[0].length}`;
    }
    if (timeArr[1].length !== 2)
    {
        throw `Error: ${timeArr[1]} minute string has length ${timeArr[1].length}`;
    }

	//check a number is at each location after splitting
    for (let i=0;i<timeArr[0].length;i++)
    {
        if (timeArr[0].charCodeAt(i) < 48 || timeArr[0].charCodeAt(i) > 57)
        {
            throw `Error: ${timeArr[0][i]} is not a number`;
        }
    }
    for (let i=0;i<timeArr[1].length;i++)
    {
        if (timeArr[1].charCodeAt(i) < 48 || timeArr[1].charCodeAt(i) > 57)
        {
            throw `Error: ${timeArr[1][i]} is not a number`;
        }
    }

	let timeHourString = timeArr[0];
    let timeMinuteString = timeArr[1];

	let timeHourInt = parseInt(timeHourString);
    let timeMinuteInt = parseInt(timeMinuteString);

	if (isNaN(timeHourInt) === true || isNaN(timeMinuteInt) === true)
    {
        throw "Error: HH:MM has converted to not a number";
    }

	//24:00 will only be a valid closingTime	
	if (timeHourInt < 0 || timeHourInt > 24)
    {
        throw `Error: ${timeHourInt} out of range 0 to 24`;
    }
    if (timeMinuteInt < 0 || timeMinuteInt > 59)
    {
        throw `Error: ${timeMinuteInt} out of range 0 to 59`;
    }
	if (!(timeMinuteInt == 0 || timeMinuteInt == 15 || timeMinuteInt == 30 || timeMinuteInt == 45))
    {
        throw `Error: ${timeMinuteInt} not in typical 15 minute increments`;
    }
	if (timeHourInt == 24 && timeMinuteInt > 0)
	{
		throw `Error: ${time} out of range`;
	}
	if (isClosingTime == false && timeHourInt == 24 && timeMinuteInt == 0)
	{
		throw `Error: ${time} is only a valid time if it is a closingTime`;
	}
	return time;
}
const validTimeInRange = (time, courtOpening, courtClosing) => {
	/*
	valid time format is a string in HH:MM format (military time)
	time, courtOpening, courtClosing are received as strings in valid time format
	*/

}

export default { validId, validStr, validStrArr, validNumber, validAddress, validState, validZip, validTime, validTimeInRange};
