import { courts } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { validId, validStr, validStrArr, validNumber, validAddress, validState, validZip, validTime, validTimeInRange } from "../validation.js";
import * as courtDataFunctions from './courts.js';

const getSchedule = async (courtId) => {
  courtId = validId(courtId);
  let court = await courtDataFunctions.getCourtById(courtId);
  if (!court)
  {
    throw "schedule.js: court with supplied id is null or undefined";
  }
  if (!court.schedule)
  {
    throw "schedule.js: court has no schedule key";
  }
  if (typeof court.schedule != "object")
  {
    throw "schedule.js: getCourtById returns a court with a schedule that is not an object";
  }
  return court.schedule;

};
const addToSchedule = async (courtId, ...args) => {
  //
};
const removeFromSchedule = async (courtId, userId, ...args) => {
  //
};
const clearSchedule = async (courtId, ...args) => {
  //
};

export {getSchedule, addToSchedule, removeFromSchedule, clearSchedule};
