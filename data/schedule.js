import { courts } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { validId, validStr, validStrArr, validNumber, validAddress, validState, validZip } from "../validation.js";

const exportedMethods = {
  async getSchedule(courtId) {

  },
  async addToSchedule(courtId, ...args) {
    //
  },
  async removeFromSchedule(courtId, ...args) {
    //
  },
  async clearSchedule(courtId, ...args) {
    //
  },
};

export default exportedMethods;
