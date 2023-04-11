import { courts } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { validId, validStr, validStrArr, validNumber, validAddress, validState, validZip } from "../validation.js";

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
    courtOpening,
    courtClosing,
    ownerId
  ) {
    //check and trim strings
    name = validStr(name, "Name");
    type = validStr(type, "Type");

    //check and trim all address variables
    //address = validAddress(address);
    //city = validCity(city);
    state = validState(state);
  },
  async getCourtsByName(name) {
    //check and trim strings
    
  }
};

export default exportedMethods;
