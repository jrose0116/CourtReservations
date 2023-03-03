import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

const validId = (id, errorPrefix) => {
  if (!id) throw errorPrefix + " Id not provided";
  if (typeof id !== "string") throw errorPrefix + " Id must be a string";
  if (id.trim().length === 0)
    throw errorPrefix + " Id must be a non-empty string that is not whitespace";
  id = id.trim();
  if (!ObjectId.isValid(id)) throw errorPrefix + " Id is invalid";
  return id;
};

const findOne = async (obj, errorPrefix) => {
  if (!obj) throw errorPrefix + " Object does not exist";

  const usersCollection = await users();
  const user = await usersCollection.findOne(obj);

  if (user === null) throw errorPrefix + " No user found";

  user._id = user._id.toString();
  return user;
};

const exportedMethods = {
  async getUserById(id) {
    try {
      id = validId(id, "Error (data/users.js :: getUserById(id)):");
    } catch (e) {
      throw e;
    }

    return await findOne(
      { _id: new ObjectId(id) },
      "Error (data/users.js :: getUserById(id)):"
    );
  },
};

export default exportedMethods;
