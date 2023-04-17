import { users, courts } from "../config/mongoCollections.js";
import {
  validId,
  validStr,
  validStrArr,
  validNumber,
  validTime,
  validDate,
} from "../validation.js";

const appendToHistory = async (userId, courtId, date, startTime, endTime) => {
  try {
    userId = validId(userId);
    courtId = validId(courtId);
    date = validDate(date);
    startTime = validTime(startTime, false);
    endTime = validTime(endTime, true);
  } catch (e) {
    throw (
      "Error (data/history.js :: appendToHistory(userId, courtId, date, startTime, endTime)):" +
      e
    );
  }

  const usersCollection = await users();
  const user = await usersCollection.findOne({
    _id: new ObjectId(userId),
  });

  if (user === null)
    throw "Error (data/history.js :: appendToHistory(userId, courtId, date, startTime, endTime)): User not found";

  const courtsCollection = await courts();
  const court = await courtsCollection.findOne({
    _id: new ObjectId(courtId),
  });

  if (court === null)
    throw "Error (data/history.js :: appendToHistory(userId, courtId, date, startTime, endTime)): Court not found";

  let history = user.history;
  let historyEntry = {
    _id: new ObjectId(),
    court_id: courtId,
    date,
    startTime,
    endTime,
  };
  history.push(historyEntry);

  const updatedInfo = await usersCollection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $set: { history: history } },
    { returnDocument: "after" }
  );

  if (updatedInfo.lastErrorObject.n === 0)
    throw "Error (data/history.js :: appendToHistory(userId, courtId, date, startTime, endTime)): Could not update user";

  historyEntry._id = historyEntry._id.toString();

  return historyEntry;
};

const deleteHistoryItem = async (historyItemId) => {
  try {
    historyItemId = validId(historyItemId);
  } catch (e) {
    throw "Error (data/history.js :: deleteHistoryItem(historyItemId): " + e;
  }

  const usersCollection = await users();
  const user = await usersCollection.findOne({
    history: { $elemMatch: { _id: new ObjectId(historyItemId) } },
  });

  if (user == null)
    throw "Error (data/history.js :: deleteHistoryItem(historyItemId): History Item not found";

  let found = false;
  let history = user.history;
  for (let i in history) {
    if (history[i]._id.toString() == historyItemId) {
      history[i]._id = history[i]._id.toString();
      reviews.splice(i, 1);
      found = true;
    }
  }

  if (!found)
    throw "Error (data/history.js :: deleteHistoryItem(historyItemId): History Item not found";

  const updatedInfo = await usersCollection.findOneAndUpdate(
    { _id: user._id },
    { $set: { history: history } },
    { returnDocument: "after" }
  );

  if (updatedInfo.lastErrorObject.n === 0)
    throw "Error (data/history.js :: deleteHistoryItem(historyItemId): Could not update user";

  updatedInfo.value._id = updatedInfo.value._id.toString();
  for (let i of updatedInfo.value.reviews) {
    i._id = i._id.toString();
  }
  for (let i of updatedInfo.value.history) {
    i._id = i._id.toString();
  }

  return updatedInfo.value;
};
const getHistory = async (userId) => {
  try {
    userId = validId(userId);
  } catch (e) {
    throw "Error (data/history.js :: getHistory(userId)):" + e;
  }

  const usersCollection = await users();
  const user = await usersCollection.findOne({
    _id: new ObjectId(userId),
  });

  if (user === null)
    throw "Error (data/history.js :: getHistory(userId)): User not found";

  for (let i of user.history) {
    i._id = i._id.toString();
  }

  return user.history;
};

const getUpcomingHistory = async (userId) => {
  try {
    userId = validId(userId);
  } catch (e) {
    throw "Error (data/history.js :: getHistory(userId)):" + e;
  }

  const usersCollection = await users();
  const user = await usersCollection.findOne({
    _id: new ObjectId(userId),
  });

  if (user === null)
    throw "Error (data/history.js :: getHistory(userId)): User not found";

  const today = new Date();
  user.history.map((val) => {
    val._id = val._id.toString();
  });
  return user.history.filter((val) => {
    const iDate = new Date(`${i.date} ${i.startTime}`);
    return iDate < today;
  });
  // for (let i of user.history.reverse()) {
  //   // Reversed so the order remains the same when pushed
  // }

  // return user.history;
};

const getHistoryItem = async (historyItemId) => {
  try {
    historyItemId = validId(historyItemId);
  } catch (e) {
    throw "Error (data/history.js :: getHistoryItem(historyItemId): " + e;
  }

  const usersCollection = await users();
  const user = await usersCollection.findOne({
    history: { $elemMatch: { _id: new ObjectId(historyItemId) } },
  });

  if (user == null)
    throw "Error (data/history.js :: getHistoryItem(historyItemId): History Item not found";

  let history = user.history;
  for (let i in history) {
    if (history[i]._id.toString() == historyItemId) {
      history[i]._id = history[i]._id.toString();
      return history[i];
    }
  }

  throw "Error (data/history.js :: getHistoryItem(historyItemId): History Item not found";
};

export {
  appendToHistory,
  deleteHistoryItem,
  getHistory,
  getHistoryItem,
  getUpcomingHistory,
};
