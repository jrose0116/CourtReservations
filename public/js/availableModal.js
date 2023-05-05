let modal = document.getElementById("filter-modal");
let filterButton = document.getElementById("filter-btn");
let closeModal = document.getElementById("close-modal");
let filterForm = document.getElementById("filter-form");

let zipBox = document.getElementById("zip-checkbox");
let zipDiv = document.getElementById("zip-div");
let levelBox = document.getElementById("level-checkbox");
let levelDiv = document.getElementById("level-div");
let sportBox = document.getElementById("sport-checkbox");
let sportDiv = document.getElementById("sport-div");

let checkboxError = document.getElementById("checkbox-error");
let zipError = document.getElementById("zip-error");
let distanceError = document.getElementById("distance-error");
let levelError = document.getElementById("level-error");
let sportError = document.getElementById("sport-error");

const validSport = (sport) => {
  sport = validStr(sport, "Sport").toLowerCase();
  if (sport == "n/a") throw "Select a Sport";

  let sports = ["basketball", "tennis", "pickleball", "volleyball"];
  if (!sports.includes(sport)) throw "Invalid Sport";

  return sport;
};

const validLevel = (level) => {
  level = validStr(level, "Level").toLowerCase();
  if (level == "n/a") throw "Select a Player Level";

  let levels = ["beginner", "intermediate", "advanced"];
  if (!levels.includes(level)) throw "Invalid Player Level";

  return level;
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

filterButton.onclick = () => {
  modal.style.display = "block";
  filterButton.style.display = "none";
};

closeModal.onclick = () => {
  modal.style.display = "none";
  filterButton.style.display = "block";
};

zipBox.addEventListener("change", (event) => {
  checkboxError.style.display = "none";
  if (event.target.checked) {
    zipDiv.style.display = "block";
  } else {
    zipDiv.style.display = "none";
  }
});

levelBox.addEventListener("change", (event) => {
  checkboxError.style.display = "none";
  if (event.target.checked) {
    levelDiv.style.display = "block";
  } else {
    levelDiv.style.display = "none";
  }
});

sportBox.addEventListener("change", (event) => {
  checkboxError.style.display = "none";
  if (event.target.checked) {
    sportDiv.style.display = "block";
  } else {
    sportDiv.style.display = "none";
  }
});

filterForm.addEventListener("submit", (event) => {
  zipError.style.display = "none";
  distanceError.style.display = "none";
  levelError.style.display = "none";
  sportError.style.display = "none";
  if (!zipBox.checked && !levelBox.checked && !sportBox.checked) {
    event.preventDefault();
    checkboxError.style.display = "block";
  }

  if (zipBox.checked) {
    try {
      validZip(document.getElementById("zip").value);
    } catch (e) {
      event.preventDefault();
      zipError.style.display = "block";
      zipError.innerHTML = e;
    }

    try {
      if (
        !document.getElementById("distance").value ||
        document.getElementById("distance").value.trim().length == 0
      )
        throw "Error: Distance not provided";

      validNumber(
        parseInt(document.getElementById("distance").value),
        "Distance",
        true,
        0,
        250
      );
    } catch (e) {
      event.preventDefault();
      distanceError.style.display = "block";
      distanceError.innerHTML = e;
    }
  }

  if (levelBox.checked) {
    try {
      validLevel(document.getElementById("levelInput").value);
    } catch (e) {
      event.preventDefault();
      levelError.style.display = "block";
      levelError.innerHTML = e;
    }
  }

  if (sportBox.checked) {
    try {
      validSport(document.getElementById("sport").value);
    } catch (e) {
      event.preventDefault();
      sportError.style.display = "block";
      sportError.innerHTML = e;
    }
  }
});
