import { users } from "../config/mongoCollections.js";
import { validId, validStr, validStrArr, validNumber } from "../validation.js";

const appendToHistory = async (userId, courtId, date, startTime, endTime) => {
  //
};
const deleteHistoryItem = async (historyItemId) => {
  //
};
const getHistory = async (userId) => {
  //
};
const getHistoryItem = async (historyItem) => {
  //
};

export {appendToHistory, deleteHistoryItem, getHistory, getHistoryItem};
