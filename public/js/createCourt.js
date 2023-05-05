let courtForm = document.getElementById("form");

let name = document.getElementById("name");
let type = document.getElementById("type");
let address = document.getElementById("address");
let city = document.getElementById("city");
let state = document.getElementById("state");
let zip = document.getElementById("zip");
let capacity = document.getElementById("capacity");
let length = document.getElementById("length");
let width = document.getElementById("width");
let courtOpening = document.getElementById("courtOpening");
let courtClosing = document.getElementById("courtClosing");
let errorDiv = document.getElementById("error-div");

/*-------------------------------ERROR CHECKING FUNCTIONS----------------------------------------*/
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


const validState = (state) => {
	/*
	Validates a 2 letter state abbreviation and returns it trimmed.
	*/
	state = validStr(state, "State"); 	//check and trim string
	if (state.length != 2) {
		throw `Error: State must be its 2 letter abbreviation.`
	}
	state = state.toUpperCase();

	let states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
				'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']
	if (!states.includes(state)) {
		throw `Error: State must be valid state.`
	}
	return state;
};

const validZip = (zip) => {
  /*
  Verifies that a given U.S. zip code is valid
  */
  validStr(zip, "Zip");
  zip = zip.trim();
  let isValid = /^\d{5}(?:[-\s]\d{4})?$/.test(zip);
  if (!isValid) {
    throw "Error: Invalid US Zip Code";
  }
  return zip;
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

const validTime = (time, isEndTime) => {
	/*
	(string, boolean)
	Verifies the time is a string in HH:MM format (military time)
	isEndTime boolean -> 24:00 is only valid if it is a closing time or booking end time
		true if courtClosing time or if endTime
		false if anything else
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

	//24:00 will only be a valid closingTime or endTime
    //00:00 converts to 24:00 if end time
    if (timeHourInt == 0 && timeMinuteInt == 0 && isEndTime == true)
    {
        timeHourInt = 24;
        timeMinuteInt = 0;
        time = "24:00";
    }
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
        throw `Error: ${timeMinuteInt} not in typical 15 minute intervals`;
    }
	if (timeHourInt == 24 && timeMinuteInt > 0)
	{
		throw `Error: ${time} out of range`;
	}
	if (isEndTime == false && timeHourInt == 24 && timeMinuteInt == 0)
	{
		throw `Error: ${time} is only a valid time if it is a closingTime`;
	}
	return time;
}

/*------------------------------------ALL DONE, NOW ACTUAL CHECKING---------------------------------*/

if (courtForm) {
  courtForm.addEventListener('submit', (event) => {
    errorDiv.hidden = false;
    errorDiv.innerHTML = "";
    let emptyName = false;
    let emptyType = false;
    let emptyAddress = false;
    let emptyCity = false;
    let emptyState = false;
    let emptyZip = false;
    let emptyCapacity = false;
    let emptyLength = false;
    let emptyWidth = false;
    let emptyCourtOpening = false;
    let emptyCourtClosing = false;

    //checking court name
    if (name.value.trim() === "") {
      event.preventDefault();
      emptyName = true;
      let message = document.createElement('p');
      message.innerHTML = "name is required!"
      errorDiv.appendChild(message);
    }
    if (!emptyName) {
      try {
        name.value = validStr(name.value);
      } catch (e) {
        event.preventDefault();
        let message = document.createElement('p');
        message.innerHTML = "Name is not valid"
        console.log(e)
        errorDiv.appendChild(message);
      }
    }

    //checking court type
    if (type.value.trim() === "") {
      event.preventDefault();
      emptyType = true;
      let message = document.createElement('p');
      message.innerHTML = "type is required!"
      errorDiv.appendChild(message);
    }
    if (!emptyType) {
      try {
        type.value = validStr(type.value);
      } catch (e) {
        event.preventDefault();
        let message = document.createElement('p');
        message.innerHTML = "Type is not valid"
        console.log(e)
        errorDiv.appendChild(message);
      }
    }

    //checking court address
    if (address.value.trim() === "") {
      event.preventDefault();
      emptyAddress = true;
      let message = document.createElement('p');
      message.innerHTML = "Address is required!"
      errorDiv.appendChild(message);
    }
    if (!emptyAddress) {
      try {
        address.value = validStr(address.value);
      } catch (e) {
        event.preventDefault();
        let message = document.createElement('p');
        message.innerHTML = "Address is not valid"
        console.log(e)
        errorDiv.appendChild(message);
      }
    }

    //checking court city
    if (city.value.trim() === "") {
      event.preventDefault();
      emptyCity = true;
      let message = document.createElement('p');
      message.innerHTML = "City is required!"
      errorDiv.appendChild(message);
    }
    if (!emptyCity) {
      try {
        city.value = validStr(city.value);
      } catch (e) {
        event.preventDefault();
        let message = document.createElement('p');
        message.innerHTML = "City is not valid"
        console.log(e)
        errorDiv.appendChild(message);
      }
    }

    //checking court state
    if (state.value.trim() === "") {
      event.preventDefault();
      emptyState = true;
      let message = document.createElement('p');
      message.innerHTML = "State is required!"
      errorDiv.appendChild(message);
    }
    if (!emptyState) {
      try {
        state.value = validState(state.value);
      } catch (e) {
        event.preventDefault();
        let message = document.createElement('p');
        message.innerHTML = "State is not valid"
        console.log(e)
        errorDiv.appendChild(message);
      }
    }

    //checking court zip
    if (zip.value.trim() === "") {
      event.preventDefault();
      emptyZip = true;
      let message = document.createElement('p');
      message.innerHTML = "Zip is required!"
      errorDiv.appendChild(message);
    }
    if (!emptyZip) {
      try {
        zip.value = validZip(zip.value);
      } catch (e) {
        event.preventDefault();
        let message = document.createElement('p');
        message.innerHTML = "Zip is not valid"
        console.log(e)
        errorDiv.appendChild(message);
      }
    }
    
    //checking court capacity
    if (capacity.value.trim() === "") {
      event.preventDefault();
      emptyCapacity = true;
      let message = document.createElement('p');
      message.innerHTML = "Capacity is required!"
      errorDiv.appendChild(message);
    }
    if (!emptyCapacity) {
      try {
        capacity.value = validNumber(parseInt(capacity.value), "Capacity", true, 1, Infinity);
      } catch (e) {
        event.preventDefault();
        let message = document.createElement('p');
        message.innerHTML = "Capacity is not valid"
        console.log(e)
        errorDiv.appendChild(message);
      }
    }
    //checking court length
    if (length.value.trim() === "") {
      event.preventDefault();
      emptyLength = true;
      let message = document.createElement('p');
      message.innerHTML = "Length is required!"
      errorDiv.appendChild(message);
    }
    if (!emptyLength) {
      try {
        length.value = validNumber(parseInt(length.value), "Length", true, 1, Infinity);
      } catch (e) {
        event.preventDefault();
        let message = document.createElement('p');
        message.innerHTML = "Length is not valid"
        console.log(e)
        errorDiv.appendChild(message);
      }
    }
    //checking court width
    if (width.value.trim() === "") {
      event.preventDefault();
      emptyWidth = true;
      let message = document.createElement('p');
      message.innerHTML = "Width is required!"
      errorDiv.appendChild(message);
    }
    if (!emptyWidth) {
      try {
        width.value = validNumber(parseInt(width.value), "Length", true, 1, Infinity);
      } catch (e) {
        event.preventDefault();
        let message = document.createElement('p');
        message.innerHTML = "Width is not valid"
        console.log(e)
        errorDiv.appendChild(message);
      }
    }

     //checking court opening
    if (courtOpening.value.trim() === "") {
      event.preventDefault();
      emptyCourtOpening = true;
      let message = document.createElement('p');
      message.innerHTML = "CourtOpening is required!"
      errorDiv.appendChild(message);
    }
    if (!emptyCourtOpening) {
      try {
        courtOpening.value = validTime(courtOpening.value, false);
      } catch (e) {
        event.preventDefault();
        let message = document.createElement('p');
        message.innerHTML = "CourtOpening is not valid"
        console.log(e)
        errorDiv.appendChild(message);
      }
    }

     //checking court closing
    if (courtClosing.value.trim() === "") {
      event.preventDefault();
      emptyCourtClosing = true;
      let message = document.createElement('p');
      message.innerHTML = "CourtClosing is required!"
      errorDiv.appendChild(message);
    }
    if (!emptyCourtClosing) {
      try {
        courtClosing.value = validTime(courtClosing.value, true);
      } catch (e) {
        event.preventDefault();
        let message = document.createElement('p');
        message.innerHTML = "CourtClosing is not valid"
        console.log(e)
        errorDiv.appendChild(message);
      }
    }     
  });
}