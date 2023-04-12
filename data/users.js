import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { validId, validStr, validNumber, validState, validZip, validTime, validTimeInRange, validEmail, validExpLevel} from "../validation.js";

//HASH PASSWORD
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
    if (!firstName || !lastName || !username || !password || !age || !city || !state || !zip || !email || !experience_level) {
      throw "Error: All inputs must be provided";
    }
    try {
      firstName = validStr(firstName, "First name");
      lastName = validStr(lastName, "Last name");
      username = validStr(username, "Username");
      city = validStr(city, "City");
    } catch (e) {
      throw e;
    }
    try {
      age = validNumber(age, "Age");
    } catch (e) {
      throw e;
    }
    // age must be above 13
    if (age < 13) {
      throw "Error: user must be 13 or older to join";
    }
    // CHECK CITY SOMEHOW
    try {
      state = validState(state);
    } catch (e) {
      throw e;
    }
    try {
      zip = validZip(zip);
    } catch (e) {
      throw (e);
    }
     try {
      email = validEmail(email);
    } catch (e) {
      throw (e);
    }
     try {
      experience_level = validExpLevel(experience_level);
    } catch (e) {
      throw (e);
    }
    let addUser = {
      firstName: firstName,
      lastName: lastName,
      username: username.toLowerCase(),
      password: password,
      age: age,
      city: city,
      state: state,
      zip: zip,
      email: email.toLowerCase(),
      experience_level: experience_level,
      reviews: [],
      history: []
    }
    const usersCollection = await users();
    // check if username already exists
    const checkUsername = await usersCollection.findOne({ username: new RegExp("^" + username, "i") });
    if (checkUsername !== null) {
      throw "Error: another user has this username."
    }
    const insertInfo = await usersCollection.insertOne(addUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add band';

    const newId = insertInfo.insertedId.toString();

    const user = await getUserById(newId);
    return user;
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

// returns array of objects of all the people with that name
const getUserByName = async(firstname, lastname) => {
    try {
      firstname = validStr(firstname);
      lastname = validStr(lastname);
    } catch (e) {
      throw e;
    }
    const usersCollection = await users();
    // case insensitive search
    const user = await usersCollection.find({firstName: { $regex : new RegExp("^" + firstname, "i") }, lastName: { $regex : new RegExp("^" + lastname, "i") } }).toArray();
    if (user.length === 0) throw 'No user with that name';
    for (let i = 0; i < user.length; i++){
      user[i]._id = user[i]._id.toString();
    }
    return user;
};

const getUserByUsername = async(username) => {
    try {
      username = validStr(username);
    } catch (e) {
      throw e;
    }
    const usersCollection = await users();
    const user = await usersCollection.findOne({ username: { $regex: new RegExp("^" + username, "i") } });
    if (user === null) throw 'No user with that username';
    user._id = user._id.toString()
    return user;
};

  // does not update password
const updateUser = async(
    id,
    firstName,
    lastName,
    username,
    age,
    city,
    state,
    zip,
    email,
    experience_level
  ) => {
    if (!firstName || !lastName || !username || !age || !city || !state || !zip || !email || !experience_level) {
      throw "Error: All inputs must be provided";
    }
      try {
      firstName = validStr(firstName);
      lastName = validStr(lastName);
      username = validStr(username);
      city = validStr(city);
    } catch (e) {
      throw e;
    }
    try {
      age = validNumber(age);
    } catch (e) {
      throw e;
    }
    // age must be above 13
    if (age < 13) {
      throw "Error: user must be 13 or older to join";
    }
    // CHECK CITY SOMEHOW
    try {
      state = validState(state);
    } catch (e) {
      throw e;
    }
    try {
      zip = validZip(zip);
    } catch (e) {
      throw (e);
    }
     try {
      email = validEmail(email);
    } catch (e) {
      throw (e);
    }
     try {
      experience_level = validExpLevel(experience_level);
    } catch (e) {
      throw (e);
     }
    try {
      id = validId(id);
    } catch (e) {
      throw (e);
    }
    let updatedUser = {
      firstName: firstName,
      lastName: lastName,
      username: username,
      age: age,
      city: city,
      state: state,
      zip: zip,
      email: email,
      experience_level: experience_level
    }
    const usersCollection = await users();
     const updateInfo = await usersCollection.findOneAndUpdate(
       { _id: new ObjectId(id) },
       { $set: updatedUser },
       { returnDocument: 'after' }
     );
    if (updateInfo.lastErrorObject.n === 0) throw "Error: Update failed";
    // check if username already exists
     let finalUser = await updateInfo.value;
     finalUser._id = finalUser._id.toString();
     for (let i = 0; i < finalUser.reviews.length; i++){
       finalUser.reviews[i]._id = finalUser.reviews[i]._id.toString();
     }
    for (let i = 0; i < finalUser.history.length; i++){
       finalUser.history[i]._id = finalUser.history[i]._id.toString();
    }
    // check if username already exists
    const checkUsername = await usersCollection.find({username: finalUser.username }).toArray()
    if (checkUsername.length > 1) {
      throw "Error: another user has this username."
    }
     return finalUser;
};

export {createUser, getUserById, getUserByName, getUserByUsername, updateUser};
