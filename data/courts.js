import { courts } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import {
  validId,
  validStr,
  validStrArr,
  validNumber,
  validAddress,
  validState,
  validZip,
  validTime,
} from "../validation.js";

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
  name = validStr(name, "Name");
  type = validStr(type, "Type of court");

  //address = validAddress(address);
  //city = validCity(city);
  //state = validState(state);
  //zip = validZip(zip);

  validNumber(capacity, "Capacity", true, 0, Infinity);
  validNumber(length, "Length", false, 0, Infinity);
  validNumber(width, "Width", false, 0, Infinity);

  courtOpening = validTime(courtOpening, false);
  courtClosing = validTime(courtClosing, true);

  ownerId = validId(ownerId);

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
    },
    courtOpening,
    courtClosing,
    ownerId,
  };

  const courtCollection = await courts();
  const insertInfo = await courtCollection.insertOne(newCourt);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw "Error: Could not add court";
  }

  newCourt._id = insertInfo.insertedId.toString();

  return newCourt;
};

const getAllCourts = async () => {
  let allCourts;
  try {
    const courtsCollection = await courts();
    allCourts = await courtsCollection.find({}).toArray();
  } catch (e) {
    throw e;
  }
  return allCourts;
};

const getCourtById = async (id) => {
  try {
    id = validId(id, "courtId");
  } catch (e) {
    throw "Error (data/courts.js :: getCourtById(id)):" + e;
  }

  const courtsCollection = await courts();
  const court = await courtsCollection.findOne({ _id: new ObjectId(id) });

  if (court === null)
    throw "Error (data/courts.js :: getCourtById(id)): No court found";

  court._id = court._id.toString();
  return court;
};

const getCourtsByName = async (courtName) => {
  courtName = validStr(courtName);

  const courtNameRegex = new RegExp(courtName, "i");
  const courtsCollection = await courts();
  const courtArr = await courtsCollection
    .find({ name: courtNameRegex })
    .toArray();

  if (courtArr.length === 0) {
    throw `Error: No courts found with this name`;
  }

  return courtArr;
};

const updateCourt = async (
  id,
  name,
  capacity,
  courtOpening,
  courtClosing,
  ownerId
) => { 
  name = validStr(name, "Name");
  validNumber(capacity, "Capacity", true, 0, Infinity);
  courtOpening = validTime(courtOpening, false);
  courtClosing = validTime(courtClosing, true);

  ownerId = validId(ownerId);

  let updatedCourt = {
    name,
    capacity,
    courtOpening,
    courtClosing,
    ownerId
  };

  const courtCollection = await courts();
  const updateInfo = await courtCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updatedCourt },
    { returnDocument: 'after' }
  );

  if (updateInfo.lastErrorObject.n === 0) throw "Error: Update failed";
  let finalCourt = await updateInfo.value;
  return finalCourt;
};

// todo: recommend courts function

export { createCourt, getAllCourts, getCourtById, getCourtsByName, updateCourt };
