import { courts } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { validId, validStr, validStrArr, validNumber, validAddress, validState, validZip, validTime, validTimeInRange, validDate} from "../validation.js";
import * as courtDataFunctions from './courts.js';
import { getUserById } from "./users.js";
import moment from 'moment';

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
const getScheduleDate = async (courtId, date) => {
  let sched = await getSchedule(courtId);
  let dateArray = sched[date];
  for (let i=0;i<dateArray.length;i++)
  {
    dateArray[i]._id = dateArray[i]._id.toString();
  }
  return dateArray;
};
const getBooking = async (courtId, bookingId, date) => {
  let schedDateArr = await getScheduleDate(courtId, date);
  for (let i=0;i<schedDateArr.length;i++)
  {
    if (schedDateArr[i]._id.localeCompare(bookingId) === 0)
    {
      return schedDateArr[i];
    }
  }
  throw `schedule.js: getBooking does not have booking with bookingId of ${bookingId} on ${date} for courtId ${courtId}`;
}
const checkBookingCapacity = async (courtId, date, startTime, endTime, capacity) => {
  //checks to make sure a booking's capacity and all other booking capacities in that range do not exceed the court capacity

  //avoid error by making sure date exists, still valid if it doesn't or is empty bc it won't exceed capacity
  let sched = await getSchedule(courtId);
  if (!sched[date])
  {
    return true;
  }
  let court = await courtDataFunctions.getCourtById(courtId);
  let scheduleOnDate = await getScheduleDate(courtId, date);
  
  let exceededTimes = [];
  let currentCapacity = capacity;//cap starts at the cap of inserting booking
  let momentInsertingStartTime = moment(startTime, 'kk:mm', 'en', true);
  let momentInsertingEndTime = moment(endTime, 'kk:mm', 'en', true);
  let momentCurrentTime = momentInsertingStartTime;
  let DBmomentStartTime;
  let DBmomentEndTime;

  while (momentCurrentTime.isBefore(momentInsertingEndTime))
  {
    for (let i=0;i<scheduleOnDate.length;i++)
    {
      DBmomentStartTime = moment(scheduleOnDate[i].startTime, 'kk:mm', 'en', true);
      DBmomentEndTime = moment(scheduleOnDate[i].endTime, 'kk:mm', 'en', true);
      if (momentCurrentTime.isSameOrAfter(DBmomentStartTime) && momentCurrentTime.isBefore(DBmomentEndTime))
      {
        currentCapacity += scheduleOnDate[i].capacity;
      }
      
    }//end for loop
    //increments/resets
    if (currentCapacity > court.capacity)
    {
      exceededTimes.push(momentCurrentTime.format("kk:mm"));
    }
    currentCapacity = capacity;
    momentCurrentTime.add(15,'minutes');
  }//end while loop

  return exceededTimes;
}
const addToSchedule = async (courtId, userId, date, startTime, endTime, capacity) => {
  //note: max 3 hrs for booking

  courtId = validId(courtId);
  userId = validId(userId);
  date = validDate(date);
  startTime = validTime(startTime);
  endTime = validTime(endTime);

  let court;
  try {
    court = await courtDataFunctions.getCourtById(courtId);
  }
  catch (e)
  {
    throw "schedule.js: getCourtsById failed";
  }
  
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

  let user;
  try 
  {
    user = await getUserById(userId);
  }
  catch (e)
  {
    throw "schedule.js: getUserById failed";
  }
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

  let momentCurrentDateTime = moment();
  let combinedDateAndStartTime = date + " " + startTime;
  let momentDateScheduled = moment(combinedDateAndStartTime, 'MM/DD/YYYY kk:mm', 'en', true);//already verified in validation

  if (momentCurrentDateTime.diff(momentDateScheduled) >= 0)//past.diff(future) = positive #
  {
    throw `schedule.js: booking with date and time ${combinedDateAndStartTime} is in the past`;
  }
  let sixMonthsAheadMark = momentCurrentDateTime.add(6, 'months');
  if (momentDateScheduled.diff(sixMonthsAheadMark) >= 0)
  {
    throw `schedule.js: booking with date and time ${combinedDateAndStartTime} cannot be over 6 months in the future`;
  }

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
  try {
    court = await courtDataFunctions.getCourtById(courtId);
  }
  catch (e)
  {
    throw "schedule.js: getCourtById (2)";
  }  

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

  //check capacity issues
  let timesOverCapArr;
  try {
    timesOverCapArr = await checkBookingCapacity(courtId, date, startTime, endTime, capacity);
  }
  catch (e)
  {
    throw "schedule.js: checkBookingCapacity failed, booking puts times over cap";
  }
  
  if (timesOverCapArr.length > 0)
  {
    throw `Error: Capacity is exceeded at the times ${timesOverCapArr}`;
  }
  
  const insertInfo = await courtCollection.updateOne(
    {_id: new ObjectId(courtId)},
    {$set: {schedule: existingSchedule} }
  );
  if (insertInfo.modifiedCount === 0)
  {
    throw "schedule.js: modifiedCount is 0";
  }

  let retArray;
  try {
    retArray = await getScheduleDate(courtId,date);
  }
  catch (e)
  {
    throw "schedule.js getScheduleDate failed";
  }

  return retArray;
};

const removeFromSchedule = async (courtId, bookingId, date) => {
  //bookingId is id within court.schedule.date
  courtId = validId(courtId);
  bookingId = validId(bookingId);
  date = validDate(date);

  let court = await courtDataFunctions.getCourtById(courtId);
  const courtCollection = await courts();

  let returnRemovedBooking = await getBooking(courtId, bookingId, date);
  let existingSchedule = court.schedule;//object
  let bookingsOnADayArray = existingSchedule[date];
  let newBookingsOnADayArray = [];
  if (!bookingsOnADayArray)
  {
    throw `schedule.js: ${date} has no bookings`;
  }

  for (let i=0;i<bookingsOnADayArray.length;i++)
  {
    let currentString = bookingsOnADayArray[i]._id.toString();
    //if different bookingId, keep in database by copying into new array
    if (currentString.localeCompare(bookingId) !== 0)
    {
      newBookingsOnADayArray.push(bookingsOnADayArray[i]);
    }
  }
  existingSchedule[date] = newBookingsOnADayArray;

  let modifiedInfo;
  if (newBookingsOnADayArray.length != 0)//update with updated schedule when array has values
  {
    modifiedInfo = await courtCollection.updateOne(
      {_id: new ObjectId(courtId)},
      {$set: {schedule: existingSchedule} }
    );
  }
  else//update by removing the date field when array is empty
  {
    delete existingSchedule[date];
    modifiedInfo = await courtCollection.updateOne(
      {_id: new ObjectId(courtId)},
      {$set: {schedule: existingSchedule}}
    );
  }

  if (modifiedInfo.modifiedCount === 0)
  {
    throw "Error: modifiedCount is 0, court doesn't exist with that courtId";
  }
  // court = await courtDataFunctions.getCourtById(courtId);
  // return court.schedule;
  return returnRemovedBooking;
};
const clearSchedule = async (courtId, date) => {
  //clears court schedule on a given date,
  courtId = validId(courtId);
  date = validDate(date);

  let court = await courtDataFunctions.getCourtById(courtId);
  const courtCollection = await courts();

  let existingSchedule = court.schedule;//object
  let bookingsOnADayArray = court.schedule[date];
  if (!bookingsOnADayArray)
  {
    throw `schedule.js: ${date} has no bookings`;
  }
  delete court.schedule[date];

  const modifiedInfo = await courtCollection.updateOne(
      {_id: new ObjectId(courtId)},
      {$set: {schedule: existingSchedule}}
    );
  
  if (modifiedInfo.modifiedCount === 0)
  {
    throw "Error: modifiedCount is 0, court doesn't exist with that courtId";
  }
  court = await courtDataFunctions.getCourtById(courtId);
  return court.schedule;
};

export {getSchedule, addToSchedule, removeFromSchedule, clearSchedule, getScheduleDate, getBooking, checkBookingCapacity};
