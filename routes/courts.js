import { Router } from "express";
import { zipCodeDistance } from "zipcode-city-distance";
import dotenv from "dotenv";
dotenv.config();

const router = Router();
import {
  createCourt,
  getCourtById,
  getAllCourts,
  getCourtsByName,
  updateCourt
} from "../data/courts.js";
import {
  addToSchedule,
  getSchedule,
  removeFromSchedule,
  clearSchedule,
  getScheduleDate,
  getBooking,
  // checkBookingCapacity,
} from "../data/schedule.js";
import {
  validId,
  validStr,
  validStrArr,
  validNumber,
  validAddress,
  validState,
  validZip,
  validTime,
  validTimeInRange,
  validDate,
} from "../validation.js";
import {
  appendToHistory,
  deleteHistoryItem,
  getHistory,
  getHistoryItem,
  getUpcomingHistory,
} from "../data/history.js";

router.route("/available").get(async (req, res) => {
  let courtList;
  try {
    courtList = await getAllCourts();
  } 
  catch (e) {
    return res.status(500).render("error", { error: e, status: 500 });
  }
  let zip = req.session.user.zip;
  courtList.map((court) => {
    court.distance = Math.floor(zipCodeDistance(zip, court.zip, "M") * 10) / 10;
  });
  courtList = courtList.filter((court) => {
    return court.distance <= 25;
  });
  courtList.map((court) => {
    if (court.distance <= 1) court.distance = "Within 1 Mile";
    else {
      court.distance = `${court.distance} Miles Away`;
    }
  });

  let upcomingList;
  try {
    upcomingList = await getUpcomingHistory(req.session.user.id);
    for (let i = 0; i < upcomingList.length; i++) {
      upcomingList[i]['court'] = await getCourtById(upcomingList[i].court_id);
    }
    // console.log(upcomingList);
  }
  catch (e) {
    return res.status(500).render("error", { error: e, status: 500 });
  }

  // console.log(upcomingList)

  return res.render("allCourts", {
    title: "Courts",
    courts: courtList,
    upcoming: upcomingList,
    auth: true,
    id: req.session.user.id,
    owner: req.session.user.owner,
  });
});

router
  .route("/create")
  .get(async (req, res) => {
    let isAuth;
    if (req.session.user) {
      isAuth = true;
    } else {
      isAuth = false;
    }
    return res.render("createCourt", {
      auth: true,
      id: req.session.user.id,
      owner: req.session.user.owner,
    });
  })
  .post(async (req, res) => {
    let newCourt = req.body;
    newCourt["ownerId"] = req.session.user.id;
    let name, type;
    try {
      name = validStr(newCourt.name);
      type = validStr(newCourt.type);
    } catch (e) {
      return res.status(400).render("createCourt", {
      auth: true,
      id: req.session.user.id,
      owner: req.session.user.owner,
      bad: e
      });
    }
    let capacity, length, width;
    try {
      capacity = validNumber(Number(newCourt.capacity));
      length = validNumber(Number(newCourt.length));
      width = validNumber(Number(newCourt.width));
    } catch (e) {
      return res.status(400).render("createCourt", {
      auth: true,
      id: req.session.user.id,
      owner: req.session.user.owner,
      bad: e
      });
    }
    let courtOpening, courtClosing;
    try {
      courtOpening = validTime(newCourt.courtOpening, false);
      courtClosing = validTime(newCourt.courtClosing, true);
    } catch (e) {
      return res.status(400).render("createCourt", {
      auth: true,
      id: req.session.user.id,
      owner: req.session.user.owner,
      bad: e
      });
    }
    let state, zip;
    try {
      state = validState(newCourt.state);
      zip = validZip(newCourt.zip);
    } catch (e) {
      return res.status(400).render("createCourt", {
      auth: true,
      id: req.session.user.id,
      owner: req.session.user.owner,
      bad: e
      });
    }
    try {
      let court = await createCourt(name, type, newCourt.address, newCourt.city, state, zip, capacity, length, width, courtOpening, courtClosing, newCourt.ownerId);
      if (court) {
        return res.redirect("/");
      }
    } catch (e) {
     return res.status(400).render("createCourt", {
      auth: true,
      id: req.session.user.id,
      owner: req.session.user.owner,
      bad: e
    });
  }
    return res.json({ create: newCourt });
  });

router.route("/recommend").get((req, res) => {
  // return res.json({ route: "Recommended courts page" });
  return res.render("recommendedCourts", {
    auth: true,
    id: req.session.user.id,
    owner: req.session.user.owner,
  });
});

router.route("/:courtId").get(async (req, res) => {
  let courtId;
  try {
    courtId = validId(req.params.courtId, "courtId");
  } catch (e) {
    return res.status(400).render("error", { error: e, status: 400 });
  }
  let thisCourt;
  try {
    thisCourt = await getCourtById(courtId);
  } catch (e) {
    return res.status(404).render("error", { error: e, status: 404 });
  }
  let schedule = thisCourt.schedule;
  delete schedule["_id"];

  // let isBooked;
  let history = await getUpcomingHistory(req.session.user.id);
  let historyList = [];
  for (let i = 0; i < history.length; i++) {
    historyList.push(history[i].court_id.toString());
  }
  // if (historyList.includes(req.params.courtId)) {
  //   isBooked = true;
  // }
  // else {
  //   isBooked = false;
  // }

  return res.render("courtById", {
    auth: true,
    title: thisCourt.name,
    court: thisCourt,
    id: req.session.user.id,
    owner: req.session.user.owner,
    // booked: isBooked,
    apiKey: process.env.MAPS_API_KEY,
    ownCourt: thisCourt.ownerId == req.session.user.id,
    schedule: schedule, 
    totalCapacity: thisCourt.capacity
  });
});

router.route("/:courtId/reserve").get(async (req, res) => {
  let thisCourt;
  try {
    let courtId = validId(req.params.courtId);
    thisCourt = await getCourtById(courtId);
  } catch (e) {
    const strError =
      "This error occurred in the /:courtId/reserve route because a court with the supplied id does not exist. Click a link on the court by id page to avoid this issue.";
    return res.status(404).json({ error: strError });
    //return res.status(404).render('error', {error: strError});
  }

  var currentDate = new Date();
  var year = currentDate.getFullYear();
  var month = String(currentDate.getMonth() + 1).padStart(2, "0");
  var day = String(currentDate.getDate()).padStart(2, "0");
  var currentDateStr = year + "-" + month + "-" + day;

  var maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 1);
  var maxYear = maxDate.getFullYear();
  var maxMonth = String(maxDate.getMonth() + 6).padStart(2, "0");
  var maxDay = String(maxDate.getDate()).padStart(2, "0");
  var maxDateStr = maxYear + "-" + maxMonth + "-" + maxDay;

  return res.render("makeReservation", {
    auth: true,
    title: `Reserve ${thisCourt.name}`,
    court: thisCourt,
    id: thisCourt._id,
    mindate: currentDateStr,
    maxdate: maxDateStr,
    schedule: thisCourt.schedule,
    owner: req.session.user.owner,
  });
});

router.route("/:courtId/reserve").post(async (req, res) => {
  let thisCourt;
  try {
    //get court
    req.params.courtId = validId(req.params.courtId, "court ID");
    thisCourt = await getCourtById(req.params.courtId);
  } catch (e) {
    const strError =
      "This error occurred in the /:courtId/reserve route because a court with the supplied id does not exist. Click a link on the court by id page to avoid this issue.";
    return res.status(404).json({ error: strError });
    //return res.status(404).render('error', {error: strError});
  }
  let newDateStr;
  let newCap;
  try {
	console.log("Validations");
    //validations
    if (!req || !req.body) {
      const strError =
        "This error occurred because in the /:courtId/reserve route, it had no req body.";
      return res.status(400).render("error", { error: strError, auth: true }); //number is good
    }
    if (!req.session || !req.session.user || !req.session.user.id) {
      const strError =
        "This error occurred because in the /:courtId/reserve route, it had no req session user.";
      return res.status(400).render("error", { error: strError, auth: true }); //number is good
    }

    //console.log("A");
    req.session.user.id = validId(req.session.user.id, "user ID from req.session");
    //console.log(req.session.user.id);

    let dateArr = req.body.selectedDate.split("-");
    newDateStr = dateArr[1] + "/" + dateArr[2] + "/" + dateArr[0];
    newDateStr = validDate(newDateStr);

    req.body.startTime = validTime(req.body.startTime, false);
    req.body.endTime = validTime(req.body.endTime, true);

    validTimeInRange(
      req.body.startTime,
      req.body.endTime,
      thisCourt.courtOpening,
      thisCourt.courtClosing
    );

    for (let i = 0; i < req.body.capacity.length; i++) {
      if (
        req.body.capacity.charCodeAt(i) < 48 ||
        req.body.capacity.charCodeAt(i) > 57
      ) {
        throw `Error: capacity must contain all digits`;
      }
    }
    newCap = parseInt(req.body.capacity);
    newCap = validNumber(newCap, "capacity", true, 0, thisCourt.capacity);
  } catch (e) {
    //const strError = e;
    //return res.status(404).json({ error: e });
    return res.status(404).render("makeReservation", {
      error: e,
      auth: true,
      title: `Reserve ${thisCourt.name}`,
      court: thisCourt,
      id: thisCourt._id,
      mindate: currentDateStr,
      maxdate: maxDateStr,
      schedule: thisCourt.schedule,
      owner: req.session.user.owner,
    });
  }

  //creates string for min and max input values in html time input
  var currentDate = new Date();
  var year = currentDate.getFullYear();
  var month = String(currentDate.getMonth() + 1).padStart(2, "0");
  var day = String(currentDate.getDate()).padStart(2, "0");
  var currentDateStr = year + "-" + month + "-" + day;

  var maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 1);
  var maxYear = maxDate.getFullYear();
  var maxMonth = String(maxDate.getMonth() + 6).padStart(2, "0");
  var maxDay = String(maxDate.getDate()).padStart(2, "0");
  var maxDateStr = maxYear + "-" + maxMonth + "-" + maxDay;

  try {
    //schedule data call
    let addedToSchedule = await addToSchedule(
    	req.params.courtId,//courtId,
    	req.session.user.id,
    	newDateStr,
    	req.body.startTime,
    	req.body.endTime,
    	newCap);
  } catch (e) {
    console.log("Error on schedule data call");
    //return res.status(404).json({ error: e });
    return res.status(404).render("makeReservation", {
      error: e,
      auth: true,
      title: `Reserve ${thisCourt.name}`,
      court: thisCourt,
      id: thisCourt._id,
      mindate: currentDateStr,
      maxdate: maxDateStr,
      schedule: thisCourt.schedule,
      owner: req.session.user.owner,
    });
    //return res.status(404).render('error', {error: strError});
  }
  try {
    //history data call
    let addedToHistory = await appendToHistory(//(userId, courtId, date, startTime, endTime)
    	req.session.user.id,
      req.params.courtId,//courtId,
    	newDateStr,
    	req.body.startTime,
    	req.body.endTime);
  } catch (e) {
    console.log("Error on history data call");
    //return res.status(404).json({ error: e });
    return res.status(404).render("makeReservation", {
      error: e,
      auth: true,
      title: `Reserve ${thisCourt.name}`,
      court: thisCourt,
      id: thisCourt._id,
      mindate: currentDateStr,
      maxdate: maxDateStr,
      schedule: thisCourt.schedule,
      owner: req.session.user.owner,
    });
    //return res.status(404).render('error', {error: strError});
  }

  return res.render("makeReservation", {
    auth: true,
    title: `Reserve ${thisCourt.name}`,
    court: thisCourt,
    id: thisCourt._id,
    mindate: currentDateStr,
    maxdate: maxDateStr,
    schedule: thisCourt.schedule,
    owner: req.session.user.owner,
    reserveDate: newDateStr,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    bookedForNumber: newCap
  });
});

// router.route("/:courtId/cancel")
router.route("/:courtId/:historyId/:date/cancel")
.get(async (req, res) => {
  console.log("cancellll!!!")
  //remove from history and schedule
  try {
    await deleteHistoryItem(req.params.historyId);
    //await removeFromSchedule(req.params.courtId, req.session.user.id, req.params.date);
  }
  catch (e) {
    return res.status(500).json({ error: 'Your booking was not successfully cancelled, please try again.'});
  }
  return res.redirect('/courts/available');
});

router
  .route("/:courtId/editCourt")
  .get(async (req, res) => {
    let isAuth;
    if (req.session.user) {
      isAuth = true;
    } else {
      isAuth = false;
    }
    let thisCourt;
    try {
     //get court
      req.params.courtId = validId(req.params.courtId);
      thisCourt = await getCourtById(req.params.courtId);
    } catch (e) {
      const strError = "This error occurred in the /:courtId/editCourt route because a court with the supplied id does not exist.";
      return res.status(404).json({ error: strError });
  }
    return res.render("editCourt", {
      auth: isAuth,
      courtName: thisCourt.name,
      capacity: thisCourt.capacity,
      opening: thisCourt.courtOpening,
      closing: thisCourt.courtClosing
    });
  })
  .post(async (req, res) => {
    let updatedCourt = req.body;
    let thisCourt;
     let isAuth;
    if (req.session.user) {
      isAuth = true;
    } else {
      isAuth = false;
    }
    try {
      thisCourt = await getCourtById(req.params.courtId);
    } catch (e) {
      return res.render("editCourt", {
      auth: isAuth,
      courtName: thisCourt.name,
      capacity: thisCourt.capacity,
      opening: thisCourt.courtOpening,
      closing: thisCourt.courtClosing, 
      bad: e
    });
    }
    let name;
    try {
      name = validStr(updatedCourt.name);
    } catch (e) {
      return res.render("editCourt", {
      auth: isAuth,
      courtName: thisCourt.name,
      capacity: thisCourt.capacity,
      opening: thisCourt.courtOpening,
      closing: thisCourt.courtClosing, 
      bad: e
    });
    }
    let capacity;
    try {
      capacity = validNumber(Number(updatedCourt.capacity));
    } catch (e) {
      return res.render("editCourt", {
      auth: isAuth,
      courtName: thisCourt.name,
      capacity: thisCourt.capacity,
      opening: thisCourt.courtOpening,
      closing: thisCourt.courtClosing, 
      bad: e
    });
    }
    let courtOpening, courtClosing;
    try {
      courtOpening = validTime(updatedCourt.courtOpening, false);
      courtClosing = validTime(updatedCourt.courtClosing, true);
    } catch (e) {
      return res.render("editCourt", {
      auth: isAuth,
      courtName: thisCourt.name,
      capacity: thisCourt.capacity,
      opening: thisCourt.courtOpening,
      closing: thisCourt.courtClosing, 
      bad: e
    });
    }
    updatedCourt["id"] = thisCourt._id;
    updatedCourt["ownerId"] = thisCourt.ownerId;
    try {
      let finalCourt = await updateCourt(updatedCourt.id, name, capacity, courtOpening, courtClosing, updatedCourt.ownerId);
      if (finalCourt) {
        res.redirect(`/courts/${thisCourt._id}`);
      }
    } catch (e) {
      return res.render("editCourt", {
      auth: isAuth,
      courtName: thisCourt.name,
      capacity: thisCourt.capacity,
      opening: thisCourt.courtOpening,
      closing: thisCourt.courtClosing, 
      bad: e
    });
    }
  });

export default router;
