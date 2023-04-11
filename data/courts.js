import { courts } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { validId, validStr, validStrArr, validNumber, validAddress, validState, validZip } from "../validation.js";

const createCourt = async (
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
) => {
  //check and trim strings
  name = validStr(name, "Name");
  type = validStr(type, "Type of court");

  //check and trim all address variables
  //address = validAddress(address);
  //city = validCity(city);
  state = validState(state);

  //add court
  let newCourt = {
    name,
    type,
    address,
    city,
    state,
    zip,
    capacity,
    length,
    width,
    schedule: {
      _id: new ObjectId(),
      "Sunday": [],
      "Monday": [],
      "Tuesday": [],
      "Wednesday": [],
      "Thursday": [],
      "Friday": [],
      "Saturday": []
    },
    courtOpening,
    courtClosing,
    ownerId
  };

  const courtCollection = await courts();
  const insertInfo = await courtCollection.insertOne(newCourt);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw 'Error: Could not add court';
  }

  return newCourt;
};

const getCourtById = async (id) => {
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
};

const getCourtsByName = async (name) => {
  //check and trim strings
  name = validStr(name);
};

export {createCourt, getCourtById, getCourtsByName};
