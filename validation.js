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

const validAdress = (adress) => {

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
	if (!state.includes(state)) {
		throw `Error: State must be valid state.`
	}
	return state;
};

const validZip = (zip) => {

};

export default { validId, validStr, validStrArr, validNumber, validState};
