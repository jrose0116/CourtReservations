import { users } from "../config/mongoCollections.js";
import { validId, validStr, validStrArr, validNumber } from "../validation.js";

const exportedMethods = {
  async appendToHistory(userId, courtId, date, startTime, endTime) {
    //
  },
  async deleteHistoryItem(historyItemId) {
    //
  },
  async getHistory(userId) {
    //
  },
  async getHistoryItem(historyItem) {
    //
  },
};

export default exportedMethods;
