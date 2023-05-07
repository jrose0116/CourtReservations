let reviewForm = document.getElementById("form");
let rating = document.getElementById("rating");
let comment = document.getElementById("comment");
let errorDiv = document.getElementById("error-div");


//-------------------------------------------VALIDATION FUNCTIONS------------------------------------------------
const validStr = (str, varName) => {
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


//---------------------------------------------ERROR CHECKING-----------------------------------------------


if (reviewForm) {
  reviewForm.addEventListener("submit", (event) => {
    //event.preventDefault();
    //console.log("review submit js!!!!!!");

    errorDiv.hidden = false;
    errorDiv.innerHTML = "";
    let emptyRating = false;
    let emptyComment = false;

    // check rating
    if (rating.value.trim() === "") {
      console.log("empty");
      event.preventDefault();
      emptyRating = true;
      let message = document.createElement("p");
      message.innerHTML = "Rating is required";
      errorDiv.appendChild(message);
    }
    if (!emptyRating) {
      try {
        rating.value = validNumber(parseInt(rating.value), "Rating", true, 1, 5);
      } catch (e) {
        event.preventDefault();
        let message = document.createElement("p");
        message.innerHTML = "Rating is not valid";
        errorDiv.appendChild(message);
      }
    }

     // check comment
    if (comment.value.trim() === "") {
      console.log("empty");
      event.preventDefault();
      emptyComment = true;
      let message = document.createElement("p");
      message.innerHTML = "Comment is required";
      errorDiv.appendChild(message);
    }
    if (!emptyComment) {
      try {
        comment.value = validStr(comment.value, "Comment");
      } catch (e) {
        event.preventDefault();
        let message = document.createElement("p");
        message.innerHTML = "Comment is not valid";
        errorDiv.appendChild(message);
      }
    }
  })
}