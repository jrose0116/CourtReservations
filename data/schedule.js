import { courts } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { validId, validStr, validStrArr, validNumber, validAddress, validState, validZip, validTime, validTimeInRange } from "../validation.js";

  const getSchedule = async (courtId) => {
    courtId = validId(courtId);
  };
  const addToSchedule = async (courtId, ...args) => {
    //
  };
  const removeFromSchedule = async (courtId, ...args) => {
    //
  };
  const  clearSchedule = async (courtId, ...args) => {
    //
  };

export {getSchedule, addToSchedule, removeFromSchedule, clearSchedule};
