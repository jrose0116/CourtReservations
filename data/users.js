import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

import {
  validId,
  validStr,
  validUsername,
  validNumber,
  validState,
  validZip,
  validTime,
  validTimeInRange,
  validEmail,
  validExpLevel,
  validImageUrl,
  checkPassword
} from "../validation.js";

//HASH PASSWORD
const createUser = async (
  firstName,
  lastName,
  username,
  password,
  age,
  city,
  state,
  zip,
  email,
  experience_level,
  //owner,
  image
) => {
  if (
    !firstName ||
    !lastName ||
    !username ||
    !password ||
    !age ||
    !city ||
    !state ||
    !zip ||
    !email
    // !experience_level
  ) {
    throw "Error: All inputs must be provided";
  }
  // if (owner === null) {
  //   throw "Error: owner must be provided";
  // }
  if (!image) {
    image = "/public/images/No_Image_Available.jpg";
  } else {
    image = validImageUrl(image);
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
    username = validUsername(username);
  }
  catch (e) {
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
    throw e;
  }
  try {
    email = validEmail(email);
  } catch (e) {
    throw e;
  }
  try {
    experience_level = validExpLevel(experience_level);
  } catch (e) {
    throw e;
  }
  try {
    password = checkPassword(password);
  } catch (e) {
    throw e;
  }
  // if (typeof owner !== "boolean") {
  //   throw "Error: owner must be of type boolean";
  // }
  let addUser = {
    firstName: firstName,
    lastName: lastName,
    username: username.toLowerCase(),
    password: bcrypt.hashSync(password, 10),
    age: age,
    city: city,
    state: state,
    zip: zip,
    email: email.toLowerCase(),
    image: image,
    experience_level: experience_level,
   // owner: false,
    reviews: [],
    history: [],
    overallRating: 0,
    report: []
  };
  const usersCollection = await users();
  // check if username already exists
  const checkUsername = await usersCollection.findOne({
    username: new RegExp("^" + username, "i"),
  });
  if (checkUsername !== null) {
    throw "Error: this username is taken.";
  }
  //check email doesn't exist
  const checkEmail = await usersCollection.findOne({
    email: new RegExp("^" + email.toLowerCase(), "i"),
  });
  if (checkEmail !== null) {
    throw "Error: this email is already associated with an account.";
  }
  const insertInfo = await usersCollection.insertOne(addUser);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not add user";

  const newId = insertInfo.insertedId.toString();

  const user = await getUserById(newId);
  return user;
};

const getUserById = async (id) => {
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
  for (let i of user.reviews) {
    i._id = i._id.toString();
  }
  for (let i of user.history) {
    i._id = i._id.toString();
  }
  return user;
};

// returns array of objects of all the people with that name
const getUserByName = async (firstname, lastname) => {
  try {
    firstname = validStr(firstname);
    lastname = validStr(lastname);
  } catch (e) {
    throw e;
  }
  const usersCollection = await users();
  // case insensitive search
  const user = await usersCollection
    .find({
      firstName: { $regex: new RegExp("^" + firstname, "i") },
      lastName: { $regex: new RegExp("^" + lastname, "i") },
    })
    .toArray();
  if (user.length === 0) throw "No user with that name";
  for (let i = 0; i < user.length; i++) {
    user[i]._id = user[i]._id.toString();
    for (let i of user[i].reviews) {
      i._id = i._id.toString();
    }
    for (let i of user[i].history) {
      i._id = i._id.toString();
    }
  }
  return user;
};

const getUserByUsername = async (username) => {
  try {
    username = validStr(username);
  } catch (e) {
    throw e;
  }
  const usersCollection = await users();
  const user = await usersCollection.findOne({
    username: { $regex: new RegExp("^" + username, "i") },
  });
  if (user === null) throw "No user with that username";
  user._id = user._id.toString();
  for (let i of user.reviews) {
    i._id = i._id.toString();
  }
  for (let i of user.history) {
    i._id = i._id.toString();
  }
  return user;
};

const getAllUsers = async () => {
  let allUsers;
  try {
    const usersCollection = await users();
    allUsers = await usersCollection.find({}).toArray();
  } 
  catch (e) {
    throw e;
  }
  return allUsers;
};

// does not update password
const updateUser = async (
  id,
  firstName,
  lastName,
  username,
  age,
  city,
  state,
  zip,
  email,
  experience_level,
  //owner,
  image
) => {
  if (
    !firstName ||
    !lastName ||
    !username ||
    !age ||
    !city ||
    !state ||
    !zip ||
    !email ||
    !experience_level
  ) {
    throw "Error: All inputs must be provided";
  }
  /*if (owner === null) {
    throw "Error: owner must be provided";
  }*/
  if (!image) {
    image = "/public/images/No_Image_Available.jpg";
  } else {
    image = validImageUrl(image);
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
    throw e;
  }
  try {
    email = validEmail(email);
  } catch (e) {
    throw e;
  }
  try {
    experience_level = validExpLevel(experience_level);
  } catch (e) {
    throw e;
  }
  try {
    id = validId(id);
  } catch (e) {
    throw e;
  }
 
  /*if (typeof owner !== "boolean") {
    if (typeof owner === "string") {
      if (owner === "true") {
        owner = true;
      } else if (owner === "false") {
        owner = false;
      } else {
        throw "Error: owner must be of type boolean"
      }
    } else {
      throw "Error: owner must be of type boolean";
    }
  }*/
  let updatedUser = {
    firstName: firstName,
    lastName: lastName,
    username: username,
    age: age,
    city: city,
    state: state,
    zip: zip,
    email: email,
    image: image,
    experience_level: experience_level
  };
  const usersCollection = await users();
  const updateInfo = await usersCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updatedUser },
    { returnDocument: "after" }
  );
  if (updateInfo.lastErrorObject.n === 0) throw "Error: Update failed";
  // check if username already exists
  let finalUser = await updateInfo.value;
  finalUser._id = finalUser._id.toString();
  for (let i = 0; i < finalUser.reviews.length; i++) {
    finalUser.reviews[i]._id = finalUser.reviews[i]._id.toString();
  }
  for (let i = 0; i < finalUser.history.length; i++) {
    finalUser.history[i]._id = finalUser.history[i]._id.toString();
  }
  // check if username already exists
  const checkUsername = await usersCollection
    .find({ username: finalUser.username })
    .toArray();
  if (checkUsername.length > 1) {
    throw "Error: another user has this username.";
  }
  return finalUser;
};

const checkUser = async (email, password) => {
  try {
    email = validStr(email, "email").toLowerCase();
    validStr(password, "password", 8);
  } catch (e) {
    throw "Error: " + e;
  }
  if (
    !/^[a-z0-9]+([._\-][a-z0-9]+)*@[a-z0-9]+(-[a-z0-9]+)*[a-z0-9]*\.[a-z0-9]+[a-z0-9]+$/.test(
      email
    ) ||
    email.length > 320
  )
    throw "Error: Invalid email address.";

  let passUpper = false;
  let passNumber = false;
  let passSpecial = false;
  for (let i of password) {
    if (i == " ") throw "Error: password must not contain spaces";
    if (/[A-Z]/.test(i)) passUpper = true;
    else if (/[0-9]/.test(i)) passNumber = true;
    else if (/[!@#$%^&*\(\)-_+=\[\]\{\}\\\|;:'",<.>\/?]/.test(i))
      passSpecial = true;
    else if (!/[a-z]/.test(i))
      throw "Error: password contains invalid characters";
  }
  if (!passUpper || !passNumber || !passSpecial)
    throw "Error: password must contain an uppercase character, number, and special character";

  const usersCollection = await users();
  let user;
  try {
    user = await usersCollection.findOne({ email: email });
  } catch (e) {
    throw "Error: " + e;
  }
  if (user === null) throw "Either the email address or password is invalid";

  let match = await bcrypt.compareSync(password, user.password);
  if (!match) throw "Either the email address or password is invalid";

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
    //owner: user.owner,
    id: user._id.toString(),
    zip: user.zip,
  };
};

const addReportedByUser = async (userId, writtenByUsername, writtenAboutId, reason) => {
  //userId reported it
  console.log("DATA REPORTING");
  let user, by, about;
  try {
    user = await getUserById(userId);
    by = await getUserByUsername(writtenByUsername);
    about = await getUserById(writtenAboutId);
    reason = validStr(reason, "reason");
  }
  catch (e)
  {
    throw e;
  }
  if (by._id == user._id)
  {
    throw "Error: cannot report your own review";
  }
  
  let buildReportedArray = user.report;
  for (let i=0; i<buildReportedArray.length;i++)
  {
    if (buildReportedArray[i].reviewer.localeCompare(by.username) == 0 &&
    buildReportedArray[i].reviewee.localeCompare(about.username) == 0)
    {
      throw "Error: Already reported this review";
    }
  }
  //data stored in user (reported by)
  let buildObjToPush =
  {
    reviewer: by.username,
    reviewee: about.username,//who the review is about
    reason: reason
  };
  buildReportedArray.push(buildObjToPush);

  const usersCollection = await users();

  const updateInfo = await usersCollection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $set: {report: buildReportedArray} },
    { returnDocument: "after" }
  );
  if (updateInfo.lastErrorObject.n === 0) throw "Error: Update failed";

  return buildReportedArray;
};

export {
  createUser,
  getUserById,
  getAllUsers,
  getUserByName,
  getUserByUsername,
  updateUser,
  checkUser,
  addReportedByUser
};
