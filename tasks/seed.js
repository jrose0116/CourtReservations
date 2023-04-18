// TODO: Seed file for testing purposes
import {
  createCourt,
  getAllCourts,
  getCourtById,
  getCourtsByName,
} from "../data/courts.js";
import {
  createUser,
  getUserById,
  getUserByName,
  getUserByUsername,
  updateUser,
} from "../data/users.js";
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import {
  addToSchedule,
  getSchedule,
  removeFromSchedule,
  clearSchedule,
} from "../data/schedule.js";
import {
  appendToHistory,
  deleteHistoryItem,
  getHistory,
  getHistoryItem,
  getUpcomingHistory,
} from "../data/history.js";
import {
  createReview,
  deleteReview,
  updateOverallRating,
} from "../data/reviews.js";

let printUsers = false;
let printCourts = false;
let printHistory = false;
let printReviews = true;
let printSchedule = false;

// TODO: Open Db Connection
const db = await dbConnection();
// !DUMP DB : (careful)
await db.dropDatabase();

let user1 = undefined;
let user2 = undefined;

let court1 = undefined;
let court2 = undefined;

// TODO: Seed Users ************************************************************************************************************
//add user1
try {
  user1 = await createUser(
    "Isabella  ",
    "  Stone",
    "iStONe  ",
    "jwhef:LSJ",
    20,
    "Staten Island",
    "NY",
    "07030",
    "  iBelLarOSE1@gmaiL.coM  ",
    " begINNer ",
    true
  );
  if (printUsers) console.log(user1);
} catch (e) {
  if (printUsers) console.log(e);
}

//try to add duplicate username to user1
try {
  user1 = await createUser(
    "Bella  ",
    "  Stone",
    "IstOnE  ",
    "jwhef:LSJ",
    20,
    "Staten Island",
    "NY",
    "07030",
    "  iBelLarOSE1@gmaiL.coM  ",
    " begINNer "
  );
  if (printUsers) console.log(user1);
} catch (e) {
  if (printUsers) console.log(e);
}

//add user2
try {
  user2 = await createUser(
    "  Ryan  ",
    "Giovanniello",
    "rGIoV22  ",
    "fiuwefvjksfhe",
    21,
    "Hoboken",
    "NJ",
    "07030",
    "  rgIOv123@gMAiL.coM  ",
    " INtermEdiate   ",
    false
  );
  if (printUsers) console.log(user2);
} catch (e) {
  if (printUsers) console.log(e);
}

//invalid firstName
try {
  user2 = await createUser(
    true,
    "Giovanniello",
    "rGIoV22  ",
    "fiuwefvjksfhe",
    21,
    "Hoboken",
    "NJ",
    "07030",
    "  rgIOv123@gMAiL.coM  ",
    " INtermEdiate   "
  );
  if (printUsers) console.log(user2);
} catch (e) {
  if (printUsers) console.log(e);
}

//invalid last name
try {
  user2 = await createUser(
    "  Ryan  ",
    ["Giovanniello"],
    "rGIoV22  ",
    "fiuwefvjksfhe",
    21,
    "Hoboken",
    "NJ",
    "07030",
    "  rgIOv123@gMAiL.coM  ",
    " INtermEdiate   "
  );
  if (printUsers) console.log(user2);
} catch (e) {
  if (printUsers) console.log(e);
}

//invalid username
try {
  user2 = await createUser(
    "  Ryan  ",
    "Giovanniello",
    100,
    "fiuwefvjksfhe",
    "21",
    "Hoboken",
    "NJ",
    "07030",
    "  rgIOv123@gMAiL.coM  ",
    " INtermEdiate   "
  );
  if (printUsers) console.log(user2);
} catch (e) {
  if (printUsers) console.log(e);
}

//invalid age
try {
  user2 = await createUser(
    "  Ryan  ",
    "Giovanniello",
    "rGIoV22  ",
    "fiuwefvjksfhe",
    "21",
    "Hoboken",
    "NJ",
    "07030",
    "  rgIOv123@gMAiL.coM  ",
    " INtermEdiate   "
  );
  if (printUsers) console.log(user2);
} catch (e) {
  if (printUsers) console.log(e);
}

// TODO: Seed Courts ************************************************************************************************************
try {
  court1 = await createCourt(
    "Court 1",
    "basketball",
    "100 Washington Street",
    "Hoboken",
    "NJ",
    "07030",
    8,
    50,
    100,
    "09:00",
    "19:00",
    user1._id.toString()
  );
  let courtId = court1._id.toString();
  let sched = await getSchedule(courtId);
  if (printCourts) console.log(court1);
  //console.log(sched);
  //console.log("Schedule TEST");
  let sched2 = await addToSchedule(
    court1._id.toString(),
    user1._id,
    "05/15/2023",
    "10:00",
    "11:00",
    4
  );
  //console.log("seed sched 2 result:");
  //console.log(sched2);
  let sched3 = await addToSchedule(
    court1._id.toString(),
    user1._id,
    "05/18/2023",
    "16:00",
    "17:00",
    2
  );
  //console.log("seed sched 3 result:");
  //console.log(sched3);
  //let sched4 = await addToSchedule(court1._id.toString(), user1._id, "05/18/2023", "12:00", "13:00", 1);
  //let schedFail = await addToSchedule(court1._id.toString(), user1._id, "04/16/2023", "10:30", "12:00", 1);
  //let schedFail2 = await addToSchedule(court1._id.toString(), user1._id, "02/16/2024", "10:30", "12:00", 1);
  //console.log("seed sched 4 result:");
  //console.log(sched4);

  //remove from schedule
  // let bookingId = sched2["04/15/2023"][0]._id.toString();
  // let remSched = await removeFromSchedule(courtId, bookingId, "04/15/2023");
  // console.log(remSched);
  // bookingId = sched3["04/18/2023"][0]._id.toString();
  // let remSched2 = await removeFromSchedule(courtId, bookingId, "04/18/2023");
  // console.log(remSched2);

  //clear schedule
  // let clearedSched = await clearSchedule(courtId, "04/18/2023");
  // console.log(clearedSched);

  //invalid date testing
  //let sched5 = await addToSchedule(court1._id.toString(), user1._id, "02/30/2023", "13:00", "14:00", 1);
  //console.log("seed sched 5 result:");
  //console.log(sched5);
} catch (e) {
  if (printCourts) console.log(e);
}

try {
  court2 = await createCourt(
    "Court 2",
    "tennis",
    "500 Jackson Street",
    "Hoboken",
    "NJ",
    "07030",
    5,
    80,
    200,
    "12:00",
    "18:00",
    "6434bca3a383aa375a96458e"
  );
  if (printCourts) console.log(court2);
} catch (e) {
  if (printCourts) console.log(e);
}

//invalid name
try {
  court2 = await createCourt(
    ["court"],
    "tennis",
    "500 Jackson Street",
    "Hoboken",
    "NJ",
    "07030",
    5,
    80,
    200,
    "12:00",
    "18:00",
    "6434bca3a383aa375a96458e"
  );
  if (printCourts) console.log(court2);
} catch (e) {
  if (printCourts) console.log(e);
}

//invalid type
try {
  court2 = await createCourt(
    "Court 2",
    true,
    "500 Jackson Street",
    "Hoboken",
    "NJ",
    "07030",
    5,
    80,
    200,
    "12:00",
    "18:00",
    "6434bca3a383aa375a96458e"
  );
  if (printCourts) console.log(court2);
} catch (e) {
  if (printCourts) console.log(e);
}

//invalid capacity
try {
  court2 = await createCourt(
    "Court 2",
    "tennis",
    "500 Jackson Street",
    "Hoboken",
    "NJ",
    "07030",
    "5",
    80,
    200,
    "12:00",
    "18:00",
    "6434bca3a383aa375a96458e"
  );
  if (printCourts) console.log(court2);
} catch (e) {
  if (printCourts) console.log(e);
}

//invalid length
try {
  court2 = await createCourt(
    "Court 2",
    "tennis",
    "500 Jackson Street",
    "Hoboken",
    "NJ",
    "07030",
    5,
    [80],
    200,
    "12:00",
    "18:00",
    "6434bca3a383aa375a96458e"
  );
  if (printCourts) console.log(court2);
} catch (e) {
  if (printCourts) console.log(e);
}

//invalid width
try {
  court2 = await createCourt(
    "Court 2",
    "tennis",
    "500 Jackson Street",
    "Hoboken",
    "NJ",
    "07030",
    5,
    80,
    "200",
    "12:00",
    "18:00",
    "6434bca3a383aa375a96458e"
  );
  if (printCourts) console.log(court2);
} catch (e) {
  if (printCourts) console.log(e);
}

//invalid open time
try {
  court2 = await createCourt(
    "Court 2",
    "tennis",
    "500 Jackson Street",
    "Hoboken",
    "NJ",
    "07030",
    5,
    80,
    200,
    "9:00",
    "18:00",
    "6434bca3a383aa375a96458e"
  );
  if (printCourts) console.log(court2);
} catch (e) {
  if (printCourts) console.log(e);
}

//invalid close time
try {
  court2 = await createCourt(
    "Court 2",
    "tennis",
    "500 Jackson Street",
    "Hoboken",
    "NJ",
    "07030",
    5,
    80,
    200,
    "12:00",
    2,
    "6434bca3a383aa375a96458e"
  );
  if (printCourts) console.log(court2);
} catch (e) {
  if (printCourts) console.log(e);
}

//invalid owner id
try {
  court2 = await createCourt(
    "Court 2",
    "tennis",
    "500 Jackson Street",
    "Hoboken",
    "NJ",
    "07030",
    5,
    80,
    200,
    "12:00",
    "18:00",
    "6434bca375a96458e"
  );
  if (printCourts) console.log(court2);
} catch (e) {
  if (printCourts) console.log(e);
}

// TODO: seed schedules ************************************************************************************************************

// TODO: seed history ************************************************************************************************************
if (printHistory) console.log("--- History ---");
try {
  //valid calls
  let history1 = await appendToHistory(
    user1._id.toString(),
    court1._id.toString(),
    "04/28/2023",
    "18:00",
    "19:00"
  );
  if (printHistory) console.log(history1);
  let history2 = await appendToHistory(
    user1._id.toString(),
    court1._id.toString(),
    "04/29/2023",
    "18:00",
    "19:00"
  );
  if (printHistory) console.log(history1);
  let history3 = await appendToHistory(
    user1._id.toString(),
    court1._id.toString(),
    "04/16/2023",
    "18:00",
    "19:00"
  );
  if (printHistory) console.log(history3);

  let historyGetUser = await getHistory(user1._id.toString());
  if (printHistory) console.log(historyGetUser);

  let historyGetItem = await getHistoryItem(history2._id.toString());
  if (printHistory) console.log(historyGetItem);

  let historyUpcoming = await getUpcomingHistory(user1._id.toString()); // Should not have history 3.
  if (printHistory) console.log(historyUpcoming);

  let deletedHistory1 = await deleteHistoryItem(history2._id.toString());
} catch (e) {
  if (printHistory) console.log(e);
}

//invalid calls

// TODO: seed reviews ************************************************************************************************************
try {
  let review1 = await createReview(
    user1._id.toString(),
    user2._id.toString(),
    5,
    "This person plays great!"
  );
  if (printReviews) console.log(review1);

  let review2 = await createReview(
    user2._id.toString(),
    user1._id.toString(),
    1,
    "This person was not nice on the courts!"
  );
  if (printReviews) console.log(review2);
  if (printReviews) console.log(await getUserById(user1._id.toString()));

  let delete2 = await deleteReview(review2._id.toString());
  console.log(delete2);
} catch (e) {
  if (printReviews) console.log(e);
}
// TODO: test user getters ************************************************************************************************************

// TODO: test court getters ************************************************************************************************************
//get all
//working
try {
  let courts = await getAllCourts();
  // console.log('***********************************');
  if (printCourts) console.log(courts);
} catch (e) {
  if (printCourts) console.log(e);
}

// find court by id
//working
try {
  let court = await getCourtById(court1._id.toString());
  if (printCourts) console.log(court);
} catch (e) {
  if (printCourts) console.log(e);
}

//invalid id
try {
  let court = await getCourtById("badinput");
  if (printCourts) console.log(court);
} catch (e) {
  if (printCourts) console.log(e);
}

//id not found
try {
  let court = await getCourtById("643617375f52b6748b06c321");
  if (printCourts) console.log(court);
} catch (e) {
  if (printCourts) console.log(e);
}

//find court by name
//working
try {
  let court = await getCourtsByName(" cOUrT 2  ");
  if (printCourts) console.log(court);
} catch (e) {
  if (printCourts) console.log(e);
}

//not found
try {
  let court = await getCourtsByName(" no court Like THIs  ");
  if (printCourts) console.log(court);
} catch (e) {
  if (printCourts) console.log(e);
}

// TODO: Close Connection
await closeConnection();
console.log("\nDone!");
