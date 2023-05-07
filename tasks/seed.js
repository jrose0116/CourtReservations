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
} 
catch (e) {
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
} 
catch (e) {
  if (printUsers) console.log(e);
}

let user4;
try {
  user4 = await createUser(
    "Julian",
    "Perez",
    "jsmitty33",
    "Chicken27%",
    22,
    "Piscataway",
    "NJ",
    "08854",//08855
    "33smitty@outlook.com",
    "advanced"
    //true
  );
  if (printUsers) console.log(user4);
} 
catch (e) {
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
} 
catch (e) {
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

  let sched2 = await addToSchedule(
    court1._id.toString(),
    user1._id,
    "06/05/2023",
    "10:00",
    "11:00",
    4
  );
  let history2 = await appendToHistory(
    user1._id.toString(),
    court1._id.toString(),
    "06/05/2023",
    "10:00",
    "11:00"
  );
  
  let sched3 = await addToSchedule(
    court1._id.toString(),
    user1._id,
    "06/18/2023",
    "16:00",
    "17:00",
    2
  );
  let history3 = await appendToHistory(
    user1._id.toString(),
    court1._id.toString(),
    "06/18/2023",
    "16:00",
    "17:00"
  );

  let sched4 = await addToSchedule(
    court1._id.toString(),
    user3._id,
    "06/18/2023",
    "12:00",
    "13:00",
    1
  );
  let history4 = await appendToHistory(
    user3._id.toString(),
    court1._id.toString(),
    "06/18/2023",
    "12:00",
    "13:00"
  );
} 
catch (e) {
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
  let history5 = await appendToHistory(
    user1._id.toString(),
    court1._id.toString(),
    "06/18/2023",
    "12:00",
    "13:00"
  );
}
catch (e)
{
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

let court10;
try {
  court10 = await createCourt(
    "Camp Olympic Park",
    "pickleball",
    "3120 S Cedar Crest Blvd",
    "Emmaus",
    "PA",
    "18049",
    8,
    100,
    180,
    "08:00",
    "23:00",
    user4._id.toString()
  );
  if (printCourts) console.log(court10);
} catch (e) {
  if (printCourts) console.log(e);
}

let court11;
try {
  court11 = await createCourt(
    "Elysian Park",
    "basketball",
    "1001 Hudson St",
    "Hoboken",
    "NJ",
    "07030",
    10,
    60,
    90,
    "09:00",
    "18:00",
    user4._id.toString()
  );
  if (printCourts) console.log(court11);
} catch (e) {
  if (printCourts) console.log(e);
}

let court12;
try {
  court12 = await createCourt(
    "Volleyball Court at Washington Park",
    "volleyball",
    "524 Central Ave",
    "Jersey City",
    "NJ",
    "07307",
    16,
    60,
    90,
    "07:00",
    "18:00",
    user4._id.toString()
  );
  if (printCourts) console.log(court12);
} catch (e) {
  if (printCourts) console.log(e);
}

let court13;
try {
  court13 = await createCourt(
    "Terrace Avenue Public Tennis Court",
    "tennis",
    "524 Central Ave",
    "Jersey City",
    "NJ",
    "07307",
    12,
    60,
    90,
    "07:00",
    "18:00",
    user4._id.toString()
  );
  if (printCourts) console.log(court13);
} catch (e) {
  if (printCourts) console.log(e);
}
// TODO: seed schedules ************************************************************************************************************
try {
  //add to past
  let pastsched1 = await addToSchedule(
    court3._id.toString(),
    user1._id,
    "04/08/2023",
    "12:00",
    "12:45",
    2,
    true
  );
  let pasthistory1 = await appendToHistory(
    user1._id.toString(),
    court3._id.toString(),
    "04/08/2023",
    "12:00",
    "12:45"
  );

  let pastsched1a = await addToSchedule(
    court4._id.toString(),
    user1._id,
    "03/12/2023",
    "12:00",
    "13:00",
    1,
    true
  );
  let pasthistory1a = await appendToHistory(
    user1._id.toString(),
    court4._id.toString(),
    "03/12/2023",
    "12:00",
    "13:00"
  );

  let pastsched2 = await addToSchedule(
    court2._id.toString(),
    user2._id,
    "01/15/2022",
    "13:00",
    "14:00",
    1,
    true
  );
  let pasthistory2 = await appendToHistory(
    user2._id.toString(),
    court2._id.toString(),
    "01/15/2022",
    "13:00",
    "14:00"
  );

  let pastsched2a = await addToSchedule(
    court9._id.toString(),
    user2._id,
    "02/19/2023",
    "14:00",
    "15:00",
    1,
    true
  );
  let pasthistory2a = await appendToHistory(
    user2._id.toString(),
    court9._id.toString(),
    "02/19/2023",
    "14:00",
    "15:00"
  );

  let pastsched3 = await addToSchedule(
    court3._id.toString(),
    user3._id,
    "03/19/2023",
    "14:00",
    "15:00",
    1,
    true
  );
  let pasthistory3 = await appendToHistory(
    user3._id.toString(),
    court3._id.toString(),
    "03/19/2023",
    "14:00",
    "15:00"
  );

  let pastsched3a = await addToSchedule(
    court10._id.toString(),
    user3._id,
    "03/19/2023",
    "13:00",
    "14:00",
    1,
    true
  );
  let pasthistory3a = await appendToHistory(
    user3._id.toString(),
    court10._id.toString(),
    "03/19/2023",
    "13:00",
    "14:00"
  );

  let pastsched4 = await addToSchedule(
    court4._id.toString(),
    user4._id,
    "02/27/2023",
    "13:00",
    "14:30",
    1,
    true
  );
  let pasthistory4 = await appendToHistory(
    user4._id.toString(),
    court4._id.toString(),
    "02/27/2023",
    "13:00",
    "14:30"
  );

  let pastsched4a = await addToSchedule(
    court8._id.toString(),
    user4._id,
    "03/12/2023",
    "12:30",
    "14:30",
    5,
    true
  );
  let pasthistory4a = await appendToHistory(
    user4._id.toString(),
    court8._id.toString(),
    "03/12/2023",
    "12:30",
    "14:30"
  );

  let pastsched5 = await addToSchedule(
    court11._id.toString(),
    user5._id,
    "01/12/2023",
    "12:30",
    "14:30",
    5,
    true
  );
  let pasthistory5 = await appendToHistory(
    user5._id.toString(),
    court11._id.toString(),
    "01/12/2023",
    "12:30",
    "14:30"
  );

  let pastsched5a = await addToSchedule(
    court13._id.toString(),
    user5._id,
    "05/01/2023",
    "11:30",
    "12:30",
    5,
    true
  );
  let pasthistory5a = await appendToHistory(
    user5._id.toString(),
    court13._id.toString(),
    "05/01/2023",
    "11:30",
    "12:30"
  );


  let sched6 = await addToSchedule(
    court3._id.toString(),
    user5._id,
    "06/21/2023",
    "12:00",
    "12:45",
    2
  );
  let history6 = await appendToHistory(
    user5._id.toString(),
    court3._id.toString(),
    "06/21/2023",
    "12:00",
    "12:45"
  );

  let sched7 = await addToSchedule(
    court3._id.toString(),
    user1._id,
    "06/28/2023",
    "13:00",
    "14:00",
    3
  );
  let history7 = await appendToHistory(
    user1._id.toString(),
    court3._id.toString(),
    "06/28/2023",
    "13:00",
    "14:00"
  );

  let sched8 = await addToSchedule(
    court4._id.toString(),
    user4._id,
    "06/29/2023",
    "10:00",
    "12:00",
    2
  );
  let history8 = await appendToHistory(
    user4._id.toString(),
    court4._id.toString(),
    "06/29/2023",
    "10:00",
    "12:00"
  );

  let sched9 = await addToSchedule(
    court4._id.toString(),
    user5._id,
    "06/22/2023",
    "10:00",
    "12:30",
    1
  );
  let history9 = await appendToHistory(
    user5._id.toString(),
    court4._id.toString(),
    "06/22/2023",
    "10:00",
    "12:30"
  );

  let sched10 = await addToSchedule(
    court5._id.toString(),
    user4._id,
    "06/12/2023",
    "14:00",
    "14:30",
    2
  );
  let history10 = await appendToHistory(
    user4._id.toString(),
    court5._id.toString(),
    "06/12/2023",
    "14:00",
    "14:30"
  );

  let sched11 = await addToSchedule(
    court5._id.toString(),
    user5._id,
    "06/14/2023",
    "12:00",
    "12:30",
    3
  );
  let history11 = await appendToHistory(
    user5._id.toString(),
    court5._id.toString(),
    "06/14/2023",
    "12:00",
    "12:30"
  );

  let sched12 = await addToSchedule(
    court6._id.toString(),
    user4._id,
    "06/21/2023",
    "12:00",
    "12:45",
    4
  );
  let history12 = await appendToHistory(
    user4._id.toString(),
    court6._id.toString(),
    "06/21/2023",
    "12:00",
    "12:45"
  );

  let sched13 = await addToSchedule(
    court6._id.toString(),
    user4._id,
    "07/30/2023",
    "11:00",
    "12:45",
    2
  );
  let history13 = await appendToHistory(
    user4._id.toString(),
    court6._id.toString(),
    "07/30/2023",
    "11:00",
    "12:45"
  );

  let sched14 = await addToSchedule(
    court7._id.toString(),
    user4._id,
    "06/04/2023",
    "12:00",
    "12:45",
    4
  );
  let history14 = await appendToHistory(
    user4._id.toString(),
    court7._id.toString(),
    "06/04/2023",
    "12:00",
    "12:45"
  );

  let sched15 = await addToSchedule(
    court7._id.toString(),
    user5._id,
    "06/05/2023",
    "11:00",
    "12:45",
    2
  );
  let history15 = await appendToHistory(
    user5._id.toString(),
    court7._id.toString(),
    "06/05/2023",
    "11:00",
    "12:45"
  );

  let sched16 = await addToSchedule(
    court8._id.toString(),
    user4._id,
    "06/27/2023",
    "14:00",
    "17:00",
    4
  );
  let history16 = await appendToHistory(
    user4._id.toString(),
    court8._id.toString(),
    "06/27/2023",
    "14:00",
    "17:00"
  );

  let sched17 = await addToSchedule(
    court8._id.toString(),
    user4._id,
    "08/29/2023",
    "10:00",
    "12:00",
    2
  );
  let history17 = await appendToHistory(
    user4._id.toString(),
    court8._id.toString(),
    "08/29/2023",
    "10:00",
    "12:00"
  );

  let sched18 = await addToSchedule(
    court9._id.toString(),
    user4._id,
    "06/02/2023",
    "10:00",
    "12:45",
    2
  );
  let history18 = await appendToHistory(
    user4._id.toString(),
    court9._id.toString(),
    "06/02/2023",
    "10:00",
    "12:45"
  );

  let sched19 = await addToSchedule(
    court9._id.toString(),
    user5._id,
    "06/15/2023",
    "11:00",
    "12:00",
    1
  );
  let history19 = await appendToHistory(
    user5._id.toString(),
    court9._id.toString(),
    "06/15/2023",
    "11:00",
    "12:00"
  );

  let sched20 = await addToSchedule(
    court9._id.toString(),
    user5._id,
    "07/11/2023",
    "10:00",
    "11:00",
    3
  );
  let history20 = await appendToHistory(
    user5._id.toString(),
    court9._id.toString(),
    "07/11/2023",
    "10:00",
    "11:00"
  );
  //new seeding
  let sched21 = await addToSchedule(
    court10._id.toString(),
    user2._id,
    "08/11/2023",
    "10:00",
    "11:00",
    3
  );
  let history21 = await appendToHistory(
    user2._id.toString(),
    court10._id.toString(),
    "08/11/2023",
    "10:00",
    "11:00"
  );
  let sched22 = await addToSchedule(
    court10._id.toString(),
    user4._id,
    "08/14/2023",
    "10:00",
    "11:00",
    3
  );
  let history22 = await appendToHistory(
    user4._id.toString(),
    court10._id.toString(),
    "08/14/2023",
    "10:00",
    "11:00"
  );
  let sched23 = await addToSchedule(
    court11._id.toString(),
    user4._id,
    "06/14/2023",
    "13:00",
    "14:00",
    3
  );
  let history23 = await appendToHistory(
    user4._id.toString(),
    court11._id.toString(),
    "06/14/2023",
    "13:00",
    "14:00"
  );
  let sched24 = await addToSchedule(
    court11._id.toString(),
    user2._id,
    "06/22/2023",
    "13:00",
    "14:00",
    3
  );
  let history24 = await appendToHistory(
    user2._id.toString(),
    court11._id.toString(),
    "06/22/2023",
    "13:00",
    "14:00"
  );
  let sched25 = await addToSchedule(
    court12._id.toString(),
    user2._id,
    "06/21/2023",
    "15:00",
    "15:30",
    3
  );
  let history25 = await appendToHistory(
    user2._id.toString(),
    court12._id.toString(),
    "06/21/2023",
    "15:00",
    "15:30"
  );
  let sched26 = await addToSchedule(
    court12._id.toString(),
    user4._id,
    "06/30/2023",
    "12:00",
    "13:00",
    3
  );
  let history26 = await appendToHistory(
    user4._id.toString(),
    court12._id.toString(),
    "06/30/2023",
    "12:00",
    "13:00"
  );
  let sched27 = await addToSchedule(
    court13._id.toString(),
    user4._id,
    "06/04/2023",
    "11:00",
    "13:00",
    3
  );
  let history27 = await appendToHistory(
    user4._id.toString(),
    court13._id.toString(),
    "06/04/2023",
    "11:00",
    "13:00"
  );
  let sched28 = await addToSchedule(
    court13._id.toString(),
    user2._id,
    "06/07/2023",
    "14:00",
    "14:45",
    3
  );
  let history28 = await appendToHistory(
    user2._id.toString(),
    court13._id.toString(),
    "06/07/2023",
    "14:00",
    "14:45"
  );

}
catch (e)
{
  console.log("tons of scheds error here");
  console.log(e);
}

// TODO: seed reviews ************************************************************************************************************
try {
  let review1 = await createReview(
    user1._id.toString(),
    user2._id.toString(),
    5,
    "This person plays really great!"
  );
  if (printReviews) console.log(review1);
  let review1a = await createReview(
    user1._id.toString(),
    user3._id.toString(),
    4,
    "They are really nice"
  );
  if (printReviews) console.log(review1a);

  let review2 = await createReview(
    user2._id.toString(),
    user1._id.toString(),
    1,
    "This person was not nice on the courts!"
  );
  if (printReviews) console.log(review2);
  let review2a = await createReview(
    user2._id.toString(),
    user5._id.toString(),
    1,
    "This person was not nice on the courts!"
  );
  if (printReviews) console.log(review2a);
  if (printReviews) console.log(await getUserById(user1._id.toString()));

  let review3 = await createReview(
    user3._id.toString(),
    user5._id.toString(),
    5,
    "Great player! Looking forward to playing with them again!"
  );
  if (printReviews) console.log(review3);
  let review3a = await createReview(
    user3._id.toString(),
    user2._id.toString(),
    4.5,
    "Had a great time with this player today"
  );
  if (printReviews) console.log(review3a);

  let review4 = await createReview(
    user4._id.toString(),
    user2._id.toString(),
    3.2,
    "Good player, but had a bad attitude"
  );
  if (printReviews) console.log(review4);
  let review4a = await createReview(
    user4._id.toString(),
    user3._id.toString(),
    2,
    "They were very rude to me"
  );
  if (printReviews) console.log(review4a);

  let review5 = await createReview(
    user5._id.toString(),
    user4._id.toString(),
    4,
    "Had lots of fun with them"
  );
  if (printReviews) console.log(review5);
  let review5a = await createReview(
    user5._id.toString(),
    user1._id.toString(),
    5,
    "Can't wait to play with them again!"
  );
  if (printReviews) console.log(review5a);

  // let delete2 = await deleteReview(review2._id.toString());
  // console.log(delete2);
} catch (e) {
  if (printReviews) console.log(e);
}


// TODO: Close Connection
await closeConnection();
console.log("\nDone!");
