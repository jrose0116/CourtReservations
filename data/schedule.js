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

  let buildObj = court.schedule;
  if (!buildObj[date])
  {
    buildObj[date] = [];
  }
  if (!court.schedule.date)
  {
    const insertInfo = await courtCollection.updateOne(
      {_id: new ObjectId(courtId)},
      {$set: { schedule: buildObj} }
    );
    /*
    if (insertInfo.modifiedCount === 0)
    {
      throw "schedule.js: modifiedCount is 0";
    }*/
  }
  court = await courtDataFunctions.getCourtById(courtId);
  console.log(date);
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
  
  //updates existing schedule with new booking object
  let existingSchedule = court.schedule;//object
  let bookingsOnADayArray = existingSchedule[date];
  bookingsOnADayArray.push(newBookingObj);
  existingSchedule[date] = bookingsOnADayArray;

  const insertInfo = await courtCollection.updateOne(
    {_id: new ObjectId(courtId)},
    {$set: {schedule: existingSchedule} }
  );
  if (insertInfo.modifiedCount === 0)
  {
    throw "schedule.js: modifiedCount is 0";
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
