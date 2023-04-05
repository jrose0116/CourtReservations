import { courts } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { validId, validStr, validStrArr, validNumber } from "../validation.js";

const exportedMethods = {
  async getCourtById(id) {
    try {
      id = validId(id, "userId");
    } catch (e) {
      throw "Error (data/courts.js :: getCourtById(id)):" + e;
    }

    const courtsCollection = await courts();
    const court = await courtsCollection.findOne({ _id: new ObjectId(id) });

    if (court === null)
      throw "Error (data/courts.js :: getCourtById(id)): No user found";

    user._id = user._id.toString();
    return user;
  },
  async createCourt(
    name,
    type,
    address,
    city,
    state,
    zip,
    capacity,
    length,
    width,
    ownerId
  ) {
    //
  },
  async getCourtsByName(name) {
    //
  },
  async addToSchedule(id, ...args) {
    //
  },
  async removeToSchedule(id, ...args) {
    //
  },
  async clearSchedule(id, ...args) {
    //
  },
};

export default exportedMethods;
