import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { validId, validStr, validStrArr, validNumber } from "../validation.js";

const exportedMethods = {
  async getUserById(id) {
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
  },
  async createUser(
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
  ) {
    // AGE must be > 13 legally
  },
  async getUserByName(firstname, lastname) {
    //
  },
  async getUserByUsername(username) {
    //
  },
  async updateUser(
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
  ) {
    //
  },
};

export default exportedMethods;
