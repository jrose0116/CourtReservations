import { ObjectId } from "mongodb";

const validId = (id, varName) => {
  let idName = varName || "id variable";
  if (!id) throw `Error: ${idName} not provided.`;
  if (typeof id !== "string" || id.trim().length === 0)
    throw `Error: ${idName} must be a non-empty string.`;
  id = id.trim();
  if (!ObjectId.isValid(id)) throw `Error: ${idName} is not a valid ObjectId`;
  return id;
};

const validStr = (str, varName) => {
  let strName = varName || "String variable";
  if (!str) throw `Error: ${strName} not provided`;
  if (typeof str !== "string" || str.trim().length === 0)
    throw `Error: ${strName} must be a non-empty string.`;
  str = str.trim();
  return str;
};

const validStrArr = (arr, varName) => {
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

export default { validId, validStr, validStrArr, validNumber };
