import { courts } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import {
  isAuth,
  validId,
  validStr,
  validStrArr,
  validNumber,
  validAddress,
  validState,
  validZip,
  validTime,
  validTimeInRange,
  validEmail,
  validExpLevel,
  validDate,
  validImageUrl,
  checkPassword,
  validSport
} from "../validation.js";
import { getUserById } from "./users.js";

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
  type = validSport(type);

  //address = validAddress(address);
  //city = validCity(city);
  if (typeof city != "string")
  {
    throw `Error: city is not a string`;
  }
  city = city.trim();

  state = validState(state);
  zip = validZip(zip);
  if (typeof address != "string")
  {
    throw `Error: address is not a string`;
  }
  address = address.trim();
  // try 
  // {
  //   await validAddress(address, city, state, zip);
  // }
  // catch (e)
  // {
  //   throw e;
  // }

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

const getCourtExperience = async (id) => {
  try {
    id = validId(id, "courtId");
  } catch (e) {
    throw "Error (data/courts.js :: getCourtExperience(id)):" + e;
  }

  const courtsCollection = await courts();
  const court = await courtsCollection.findOne({ _id: new ObjectId(id) });

  if (court === null)
    throw "Error (data/courts.js :: getCourtById(id)): No court found";

  court._id = court._id.toString();
  let res = 0;
  let count = 0;
  for (let i of Object.keys(court.schedule)) {
    if (i != "_id") {
      for (let j of court.schedule[i]) {
        try {
          let user = await getUserById(j.userId);
          count++;
          res +=
            user.experience_level == "beginner"
              ? 1
              : user.experience_level == "intermediate"
              ? 2
              : user.experience_level == "advanced"
              ? 3
              : 0;
        } catch (e) {
          throw e;
        }
      }
    }
  }
  res = Math.round(res / count);
  switch (res) {
    case 2:
      return "intermediate";
    case 3:
      return "advanced";
    default:
      return "beginner";
  }
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
    ownerId,
  };

  const courtCollection = await courts();
  const updateInfo = await courtCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updatedCourt },
    { returnDocument: "after" }
  );

  if (updateInfo.lastErrorObject.n === 0) throw "Error: Update failed";
  let finalCourt = await updateInfo.value;
  return finalCourt;
};

// todo: recommend courts function
const deleteCourt = async (id) => {
  if (!id) throw "You must provide an id to search for";
  if (typeof id !== "string") throw "Id must be a string";
  if (id.trim().length === 0)
    throw "Id cannot be an empty string or just spaces";
  id = id.trim();
  if (!ObjectId.isValid(id)) throw "invalid object ID";
  const courtCollection = await courts();
  const deletionInfo = await courtCollection.findOneAndDelete({
    _id: new ObjectId(id),
  });

  if (deletionInfo.lastErrorObject.n === 0) {
    throw `Could not delete court with id of ${id}`;
  }
  let obj = { bandId: deletionInfo.value._id, deleted: "true" };
  return obj;
};

const checkIfOwner = async (ownerId) => { 
  const courtCollection = await courts();
  const result = await courtCollection.findOne({ ownerId: ownerId });
  if (result) {
    return true;
  } else {
    return false;
  }
}

export {
  createCourt,
  getAllCourts,
  getCourtById,
  getCourtsByName,
  updateCourt,
  deleteCourt,
  getCourtExperience,
  checkIfOwner
};
