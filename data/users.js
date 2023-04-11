import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { validId, validStr, validStrArr, validNumber } from "../validation.js";

const createUser = async(
  firstName,
  lastName,
  username,
  password,
  age,
  city,
  state,
  zip,
  email,
  experience_level
) => {
  // AGE must be > 13 legally
};

const getUserById = async(id) => {
  try {
    id = validId(id, "userId");
  } catch (e) {
    throw "Error (data/users.js :: getUserById(id)):" + e;
  }

  const usersCollection = await users();
  const user = await usersCollection.findOne({ _id: new ObjectId(id) });

  if (user === null)
    throw "Error (data/users.js :: getUserById(id)): No user found";

  user._id = user._id.toString();
  return user;
};

const getUserByName = async (firstname, lastname) => {
  //
};

const getUserByUsername = async (username) => {
  //
};

const updateUser = async(
  id,
  firstName,
  lastName,
  username,
  password,
  age,
  city,
  state,
  zip,
  email,
  experience_level
) => {
  //
};

export {createUser, getUserById, getUserByName, getUserByUsername, updateUser};
