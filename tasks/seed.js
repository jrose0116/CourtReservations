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
  checkUser,
} from "../data/users.js";
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import {
  addToSchedule,
  getSchedule,
  removeFromSchedule,
  clearSchedule,
  getScheduleDate,
  getBooking,
  checkBookingCapacity,
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
let printReviews = false;
let printSchedule = false;

// TODO: Open Db Connection
const db = await dbConnection();
// !DUMP DB : (careful)
await db.dropDatabase();

let user1 = undefined;
let user2 = undefined;
let check1 = undefined;

let court1 = undefined;
let court2 = undefined;

// TODO: Seed Users ************************************************************************************************************
//add user1
try {
  user1 = await createUser(
    "Isabella  ",
    "  Stone",
    "iStONe  ",
    "Abcdef1!",
    20,
    "Staten Island",
    "NY",
    "07030",
    "  iBelLarOSE1@gmaiL.coM  ",
    " begINNer "
    //true
  );
  if (printUsers) console.log(user1);
} catch (e) {
  if (printUsers) console.log(e);
}

try {
  check1 = await checkUser("ibellarose1@gmail.com", "jwhef:LSJ1");
  if (printUsers) console.log(check1);
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
    "Yankees26!",
    21,
    "Hoboken",
    "NJ",
    "07030",
    "  rgIOv123@gMAiL.coM  ",
    " INtermEdiate   "
    //false
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

let user3;
try {
  user3 = await createUser(
    "Jacob",
    "Rose",
    "Jrose",
    "Password!1",
    20,
    "Marlboro",
    "NJ",
    "07751",
    "jrose0116@gmail.com",
    "beginner"
    //true
  );
  if (printUsers) console.log(user3);
} catch (e) {
  if (printUsers) console.log(e);
}

let user4;
try {
  user4 = await createUser(
    "John",
    "Smith",
    "jsmitty33",
    "Chicken27%",
    22,
    "Piscataway",
    "NJ",
    "08855",
    "33smitty@outlook.com",
    "advanced"
    //true
  );
  if (printUsers) console.log(user4);
} catch (e) {
  if (printUsers) console.log(e);
}

let user5;
try {
  user5 = await createUser(
    "Patrick",
    "Hill",
    "graffixnyc",
    "Goated123?",
    32,
    "Hoboken",
    "NJ",
    "07030",
    "phill@stevens.edu",
    "beginner"
    //true
  );
  if (printUsers) console.log(user5);
} catch (e) {
  if (printUsers) console.log(e);
}
// TODO: Seed Courts ************************************************************************************************************
try {
  court1 = await createCourt(
    "Church Square Park",
    "basketball",
    "400 Garden St",
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
    "06/05/2023",
    "10:00",
    "11:00",
    4
  );
  //console.log("seed sched 2 result:");
  //console.log(sched2);
  //console.log("end");
  let sched3 = await addToSchedule(
    court1._id.toString(),
    user1._id,
    "06/18/2023",
    "16:00",
    "17:00",
    2
  );
  //console.log("seed sched 3 result:");
  //console.log(sched3);
  let sched4 = await addToSchedule(
    court1._id.toString(),
    user3._id,
    "06/18/2023",
    "12:00",
    "13:00",
    1
  );

  //let schedFail = await addToSchedule(court1._id.toString(), user1._id, "04/16/2023", "10:30", "12:00", 1);
  //let schedFail2 = await addToSchedule(court1._id.toString(), user1._id, "02/16/2024", "10:30", "12:00", 1);
  //console.log("seed sched 4 result:");
  //console.log(sched4);

  //remove from schedule
  //let bookingId = sched2["04/25/2023"][0]._id.toString();
  // let bookingId = sched2[0]._id.toString();

  // let remSched = await removeFromSchedule(courtId, user1._id, "06/05/2023");
  // console.log("removed1:");
  // console.log(remSched);

  // bookingId = sched3[0]._id.toString();
  // let remSched2 = await removeFromSchedule(courtId, user3._id, "06/18/2023");
  // console.log("removed2:");
  // console.log(remSched2);

  //clear schedule
  //let clearedSched = await clearSchedule(courtId, "06/18/2023");
  //console.log(clearedSched);

  //invalid date testing
  //let sched5 = await addToSchedule(court1._id.toString(), user1._id, "02/30/2023", "13:00", "14:00", 1);
  //console.log("seed sched 5 result:");
  //console.log(sched5);

  //getScheduleDate
  //let getSchedDate = await getScheduleDate(courtId,"06/18/2023");
  //console.log(getSchedDate);

  //getBooking
  // console.log("GET BOOKING: ");
  // let booking = await getBooking(courtId, user1._id, "06/05/2023");
  // console.log(booking);

  //checkBookingCapacity this example is meant to error
  // let checkBookCap = await addToSchedule(
  //   court1._id.toString(),
  //   user1._id,
  //   "06/18/2023",
  //   "15:15",
  //   "16:30",
  //   7
  // );
  // console.log(checkBookCap);
} catch (e) {
  // if (printCourts)
  console.log(e);
}
try {
  let sched5 = await addToSchedule(
    court1._id.toString(),
    user1._id,
    "06/18/2023",
    "12:00",
    "13:00",
    1
  );
}
catch (e)
{
  //console.log("Successful Erroring - max 1 reservation per person per date");
  if (printCourts)
    console.log(e);
}

try {
  court2 = await createCourt(
    "7th & Jackson Resiliency Park",
    "tennis",
    "627 Jackson St",
    "Hoboken",
    "NJ",
    "07030",
    5,
    80,
    200,
    "12:00",
    "18:00",
    user4._id.toString()
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
    user4._id.toString()
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
    user4._id.toString()
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
    user4._id.toString()
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
    user4._id.toString()
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
    user4._id.toString()
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
    user4._id.toString()
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
    user4._id.toString()
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
    [a,b,c]
  );
  if (printCourts) console.log(court2);
} catch (e) {
  if (printCourts) console.log(e);
}

let court3;
try {
  court3 = await createCourt(
    "Weehawken Waterfront Park",
    "volleyball",
    "1 Port Imperial Blvd",
    "Weehawken",
    "NJ",
    "07086",
    12,
    60,
    30,
    "08:00",
    "20:00",
    user4._id.toString()
  );
  if (printCourts) console.log(court3);
} catch (e) {
  if (printCourts) console.log(e);
}

let court4;
try {
  court4 = await createCourt(
    "Ellsworth Park",
    "tennis",
    "399 24th St",
    "Union City",
    "NJ",
    "07087",
    10,
    60,
    30,
    "08:00",
    "22:00",
    user4._id.toString()
  );
  if (printCourts) console.log(court4);
} catch (e) {
  if (printCourts) console.log(e);
}

let court5;
try {
  court5 = await createCourt(
    "Leonard Gordon Park",
    "pickleball",
    "3303 John F. Kennedy Blvd",
    "Jersey City",
    "NJ",
    "07307",
    10,
    90,
    20,
    "10:00",
    "16:00",
    user4._id.toString()
  );
  if (printCourts) console.log(court5);
} catch (e) {
  if (printCourts) console.log(e);
}

let court6;
try {
  court6 = await createCourt(
    "Dr. Gertrude B. Kelly Playground",
    "pickleball",
    "320 W 17th St",
    "New York",
    "NY",
    "10011",
    6,
    90,
    70,
    "09:00",
    "18:00",
    user4._id.toString()
  );
  if (printCourts) console.log(court6);
} catch (e) {
  if (printCourts) console.log(e);
}

let court7;
try {
  court7 = await createCourt(
    "Opatut Park",
    "basketball",
    "458 E Freehold Rd",
    "Freehold",
    "NJ",
    "07728",
    20,
    140,
    200,
    "08:00",
    "18:00",
    user5._id.toString()
  );
  if (printCourts) console.log(court7);
} catch (e) {
  if (printCourts) console.log(e);
}

let court8;
try {
  court8 = await createCourt(
    "Inman Park Basketball Courts",
    "basketball",
    "290 Leupp Ln",
    "Somerset",
    "NJ",
    "08873",
    20,
    60,
    45,
    "08:00",
    "22:00",
    user4._id.toString()
  );
  if (printCourts) console.log(court8);
} catch (e) {
  if (printCourts) console.log(e);
}

let court9;
try {
  court9 = await createCourt(
    "PS2 Athletics",
    "basketball",
    "321 Hamburg Turnpike",
    "Wayne",
    "NJ",
    "07470",
    20,
    60,
    90,
    "08:00",
    "22:00",
    user4._id.toString()
  );
  if (printCourts) console.log(court9);
} catch (e) {
  if (printCourts) console.log(e);
}

// TODO: seed schedules ************************************************************************************************************
//some more scheds by court 1 but whatever
try {
  let sched6 = await addToSchedule(
    court3._id.toString(),
    user5._id,
    "06/21/2023",
    "12:00",
    "12:45",
    2
  );
  let sched7 = await addToSchedule(
    court3._id.toString(),
    user1._id,
    "06/28/2023",
    "13:00",
    "14:00",
    3
  );
  let sched8 = await addToSchedule(
    court4._id.toString(),
    user4._id,
    "06/29/2023",
    "10:00",
    "12:00",
    2
  );
  let sched9 = await addToSchedule(
    court4._id.toString(),
    user5._id,
    "06/22/2023",
    "10:00",
    "12:30",
    1
  );
  let sched10 = await addToSchedule(
    court5._id.toString(),
    user4._id,
    "06/12/2023",
    "14:00",
    "14:30",
    2
  );
  let sched11 = await addToSchedule(
    court5._id.toString(),
    user5._id,
    "06/14/2023",
    "12:00",
    "12:30",
    3
  );
  let sched12 = await addToSchedule(
    court6._id.toString(),
    user4._id,
    "06/21/2023",
    "12:00",
    "12:45",
    4
  );
  let sched13 = await addToSchedule(
    court6._id.toString(),
    user4._id,
    "06/30/2023",
    "11:00",
    "12:45",
    2
  );
  let sched14 = await addToSchedule(
    court7._id.toString(),
    user4._id,
    "06/04/2023",
    "12:00",
    "12:45",
    4
  );
  let sched15 = await addToSchedule(
    court7._id.toString(),
    user5._id,
    "06/05/2023",
    "11:00",
    "12:45",
    2
  );
  let sched16 = await addToSchedule(
    court8._id.toString(),
    user4._id,
    "06/27/2023",
    "14:00",
    "17:00",
    4
  );
  let sched17 = await addToSchedule(
    court8._id.toString(),
    user4._id,
    "06/29/2023",
    "10:00",
    "12:00",
    2
  );
  let sched18 = await addToSchedule(
    court9._id.toString(),
    user4._id,
    "06/02/2023",
    "10:00",
    "12:45",
    2
  );
  let sched19 = await addToSchedule(
    court9._id.toString(),
    user5._id,
    "06/15/2023",
    "11:00",
    "12:00",
    1
  );
  let sched20 = await addToSchedule(
    court9._id.toString(),
    user5._id,
    "07/11/2023",
    "10:00",
    "11:00",
    3
  );
}
catch (e)
{
  console.log("tons of scheds error here");
  console.log(e);
}

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
