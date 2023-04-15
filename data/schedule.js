import { courts } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { validId, validStr, validStrArr, validNumber, validAddress, validState, validZip, validTime, validTimeInRange, validDate} from "../validation.js";
import * as courtDataFunctions from './courts.js';
import { getUserById } from "./users.js";

const getSchedule = async (courtId) => {
  courtId = validId(courtId);
  let court = await courtDataFunctions.getCourtById(courtId);
  if (!court)
  {
    throw "schedule.js: court with supplied id is null or undefined";
  }
  if (!court.schedule)
  {
    throw "schedule.js: court has no schedule key";
  }
  if (typeof court.schedule != "object")
  {
    throw "schedule.js: getCourtById returns a court with a schedule that is not an object";
  }
  return court.schedule;

};
const addToSchedule = async (courtId, userId, date, startTime, endTime, capacity) => {
  //note: max 3 hrs for booking
  //TODO: verify date is in range
  //TODO: verify time is in range
  //TODO: capacity check when array if nonempty

  courtId = validId(courtId);
  userId = validId(userId);
  date = validDate(date);
  startTime = validTime(startTime);
  endTime = validTime(endTime);

  let court = await courtDataFunctions.getCourtById(courtId);
  if (!court)
  {
    throw "schedule.js: court with supplied id is null or undefined";
  }
  if (!court.schedule || !court.capacity || !court.courtOpening || !court.courtClosing)
  {
    throw "schedule.js: court attributes are null or undefined";
  }
  if (typeof court.schedule != "object")
  {
    throw "schedule.js: getCourtById returns a court with a schedule that is not an object";
  }

  let user = await getUserById(userId);
  if (!user)
  {
    throw "schedule.js: user with supplied id is null or undefined";
  }

  validTimeInRange(startTime, endTime, court.courtOpening, court.courtClosing);
  capacity = validNumber(capacity, "capacity", true, 0, court.capacity);

  let startTimeArr = startTime.split(":");
	let startTimeHourString = startTimeArr[0];
  let startTimeMinuteString = startTimeArr[1];
	let endTimeArr = endTime.split(":");
	let endTimeHourString = endTimeArr[0];
  let endTimeMinuteString = endTimeArr[1];

  let startTimeHourInt = parseInt(startTimeHourString);
  let startTimeMinuteInt = parseInt(startTimeMinuteString);
	let endTimeHourInt = parseInt(endTimeHourString);
  let endTimeMinuteInt = parseInt(endTimeMinuteString);

  let hourDifference = endTimeHourInt - startTimeHourInt;
  let minDifference = endTimeMinuteInt - startTimeMinuteInt;

  if (hourDifference >= 3)
  {
    if ((hourDifference == 3 && minDifference != 0) || hourDifference > 3)
    {
      throw "schedule.js: maximum of 3 hours for a time booking";
    }
  }

  //write TODOs here

  const courtCollection = await courts();

  //console.log(87);
  //console.log(court.schedule);
  let buildObj = court.schedule;
  buildObj[date] = [];
  //console.log(buildObj);
  if (!court.schedule.date)
  {
    //let emptyArr = [];
    //let temp = await getSchedule(courtId);
    //var currentVal = await courtCollection.findOne(scheduleId);
    //console.log(currentVal);
    const insertInfo = await courtCollection.updateOne(
      {_id: new ObjectId(courtId)},
      {$set: { schedule: buildObj} }//FIX
      //{$set: { schedule: {[date]: emptyArr}} }//FIX
      //{upsert:true}
    );
    if (insertInfo.modifiedCount === 0)
    {
      throw "schedule.js: modifiedCount is 0";
    }
  }
  court = await courtDataFunctions.getCourtById(courtId);
  console.log(date);
  console.log(court.schedule);
  if (true) //if (court.schedule.length == 0)
  {
    console.log("110");
    if (capacity > court.capacity)
    {
      throw `schedule.js: ${capacity} exceeds ${court.capacity}`;
    }
    let newBookingObj = {
      _id: new ObjectId(),
      startTime: startTime,
      endTime: endTime,
      capacity: capacity,
      userId: userId,
    };
    //let strTemp = "schedule".concat(date);
    //console.log(strTemp);
    let bookingsOnADayArray = court.schedule[date];
    //console.log(typeof bookingsOnADayArray);
    bookingsOnADayArray.push(newBookingObj);
    //console.log("130");
    //console.log(bookingsOnADayArray);

    const insertInfo = await courtCollection.updateOne(
      {_id: new ObjectId(courtId)},
      //{ $set: { schedule: {[date]: newBookingObj}} }
      //{ $push: { [strTemp]: newBookingObj} }
      //{ $push: { [date]: bookingsOnADayArray} }
      //{ $push: { schedule: {[date]: bookingsOnADayArray}} }
      {$set: {schedule: {[date]: bookingsOnADayArray}} }
    );
    if (insertInfo.modifiedCount === 0)
    {
      throw "schedule.js: modifiedCount is 0";
    }
  }
  else
  {

  }

  court = await courtDataFunctions.getCourtById(courtId);
  return court.schedule;
};
const removeFromSchedule = async (courtId, userId, date, startTime, endTime) => {
  //
};
const clearSchedule = async (courtId, date, ...args) => {
  //
};

export {getSchedule, addToSchedule, removeFromSchedule, clearSchedule};
