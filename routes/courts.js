import { Router } from "express";
import { zipCodeDistance } from "zipcode-city-distance";
import dotenv from "dotenv";
import moment from "moment";
import xss from "xss";
dotenv.config();

const router = Router();
import {
  createCourt,
  getCourtById,
  getAllCourts,
  getCourtsByName,
  updateCourt,
  deleteCourt,
  getCourtExperience,
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
  validSport,
  validExpLevel,
  militaryToStandard,
} from "../validation.js";
import {
  appendToHistory,
  deleteHistoryItem,
  getHistory,
  getHistoryItem,
  getUpcomingHistory,
  removeCourtFromHistory
} from "../data/history.js";
import {
  createUser,
  getUserById,
  getUserByName,
  getUserByUsername,
  updateUser,
} from "../data/users.js";

router
  .route("/available")
  .get(async (req, res) => {
    let courtList;
    try {
      courtList = await getAllCourts();
    } catch (e) {
      return res.status(500).render("error", { error: e, status: 500 });
    }
    let zip = req.session.user.zip;
    courtList.map((court) => {
      court.distance =
        Math.floor(zipCodeDistance(zip, court.zip, "M") * 10) / 10;
    });
    courtList = courtList.filter((court) => {
      return court.distance <= 100;
    });
    courtList.sort((a, b) => a.distance - b.distance);
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
        upcomingList[i]["court"] = await getCourtById(upcomingList[i].court_id);
      }
      // console.log(upcomingList);
    } catch (e) {
      return res.status(500).render("error", { error: e, status: 500 });
    }

    // console.log('upcomingList: ')
    // console.log(upcomingList)
    for (let i = 0; i < upcomingList.length; i++) {
      upcomingList[i].startTime = militaryToStandard(upcomingList[i].startTime);
      upcomingList[i].endTime = militaryToStandard(upcomingList[i].endTime);
    }

    // console.log(upcomingList)
    let noCourts = false;
    if (upcomingList.length === 0) {
      noCourts = true;
    }
    // console.log(noCourts)
    // console.log(courtList.length)
    // console.log(upcomingList.length)
    return res.render("allCourts", {
      title: "Courts",
      none: noCourts,
      courts: courtList,
      upcoming: upcomingList,
      auth: true,
      id: req.session.user.id,
      owner: req.session.user.owner,
    });
  })
  .post(async (req, res) => {
    let courtList;
    try {
      courtList = await getAllCourts();
    } catch (e) {
      return res.status(500).render("error", { error: e, status: 500 });
    }

    let zip = req.session.user.zip;
    let distance = 50;
    if (req.body["zip-checkbox"] == "on") {
      try {
        zip = validZip(xss(req.body.zip));
        distance = validNumber(
          parseInt(xss(req.body.distance)),
          "Distance",
          true,
          0,
          250
        );
      } catch (e) {
        return res.status(400).render("error", { status: 400, error: e });
      }
    }

    // courtList.map((court) => {});
    courtList = courtList.filter((court) => {
      court.distance =
        Math.floor(zipCodeDistance(zip, court.zip, "M") * 10) / 10;
      return court.distance <= distance;
    });
    courtList.sort((a, b) => a.distance - b.distance);
    courtList.map((court) => {
      court.distance =
        Math.floor(zipCodeDistance(req.session.user.zip, court.zip, "M") * 10) /
        10;
      if (court.distance <= 1) court.distance = "Within 1 Mile";
      else {
        court.distance = `${court.distance} Miles Away`;
      }
    });

    if (req.body["level-checkbox"] == "on") {
      let experience_level;
      try {
        experience_level = validExpLevel(xss(req.body.levelInput));

        // If court experience level is implemented

        await Promise.all(
          courtList.map(async (court) => {
            court.exp = await getCourtExperience(court._id.toString());
          })
        );

        courtList = courtList.filter((court) => {
          let exp = court.exp;
          return experience_level.toLowerCase() == exp;
        });

        console.log(courtList);
      } catch (e) {
        return res.status(400).render("error", { error: e, status: 400 });
      }
    }

    if (req.body["sport-checkbox"] == "on") {
      let sport;
      try {
        sport = validSport(xss(req.body.sport));

        courtList = courtList.filter((court) => {
          return sport.trim().toLowerCase() == court.type.trim().toLowerCase();
        });
      } catch (e) {
        return res.status(400).render("error", { error: e, status: 400 });
      }
    }

    let upcomingList;
    try {
      upcomingList = await getUpcomingHistory(req.session.user.id);
      for (let i = 0; i < upcomingList.length; i++) {
        upcomingList[i]["court"] = await getCourtById(upcomingList[i].court_id);
      }
    } catch (e) {
      return res.status(500).render("error", { error: e, status: 500 });
    }

    for (let i = 0; i < upcomingList.length; i++) {
      upcomingList[i].startTime = militaryToStandard(upcomingList[i].startTime);
      upcomingList[i].endTime = militaryToStandard(upcomingList[i].endTime);
    }

    // console.log(upcomingList)
    let noCourts = false;
    if (upcomingList.length === 0) {
      noCourts = true;
    }
    return res.render("allCourts", {
      title: "Courts",
      none: noCourts,
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
      name = validStr(xss(newCourt.name));
      type = validStr(xss(newCourt.type));
    } catch (e) {
      return res.status(400).render("createCourt", {
        auth: true,
        id: req.session.user.id,
        owner: req.session.user.owner,
        bad: e,
      });
    }
    let capacity, length, width;
    try {
      capacity = validNumber(Number(xss(newCourt.capacity)));
      length = validNumber(Number(xss(newCourt.length)));
      width = validNumber(Number(xss(newCourt.width)));
    } catch (e) {
      return res.status(400).render("createCourt", {
        auth: true,
        id: req.session.user.id,
        owner: req.session.user.owner,
        bad: e,
      });
    }
    let courtOpening, courtClosing;
    try {
      courtOpening = validTime(xss(newCourt.courtOpening), false);
      courtClosing = validTime(xss(newCourt.courtClosing), true);
      validTimeInRange(courtOpening, courtClosing, "00:00", "24:00");
    } catch (e) {
      return res.status(400).render("createCourt", {
        auth: true,
        id: req.session.user.id,
        owner: req.session.user.owner,
        bad: e,
      });
    }
    let state, zip;
    try {
      state = validState(xss(newCourt.state));
      zip = validZip(xss(newCourt.zip));
    } catch (e) {
      return res.status(400).render("createCourt", {
        auth: true,
        id: req.session.user.id,
        owner: req.session.user.owner,
        bad: e,
      });
    }
    try {
      let address = await validAddress(
        xss(newCourt.address),
        xss(newCourt.city),
        state,
        zip
      );
      if (address === false) {
        return res.status(400).render("createCourt", {
          auth: true,
          id: req.session.user.id,
          owner: req.session.user.owner,
          bad: "Invalid address",
        });
      }
    } 
    catch (e) {
      return res.status(400).render("createCourt", {
          auth: true,
          id: req.session.user.id,
          owner: req.session.user.owner,
          bad: "Invalid address",
        });
    }
    
    try {
      let court = await createCourt(
        name,
        type,
        xss(newCourt.address),
        xss(newCourt.city),
        state,
        zip,
        capacity,
        length,
        width,
        courtOpening,
        courtClosing,
        xss(newCourt.ownerId)
      );
      if (court) {
        return res.redirect("/");
      }
    } catch (e) {
      return res.status(400).render("createCourt", {
        auth: true,
        id: req.session.user.id,
        owner: req.session.user.owner,
        bad: e,
      });
    }
    return res.json({ create: newCourt });
  });

router
  .route("/recommend")
  .get((req, res) => {
    return res.render("recommendedCourts", {
      title: "Recommend Courts",
      auth: true,
      id: req.session.user.id,
      owner: req.session.user.owner,
    });
  })
  .post(async (req, res) => {
    // return res.json({ route: "Recommended courts page" });
    console.log("post recommend");
    try {
      validSport(xss(req.body.courtType));
    } catch (e) {
      return res.status(404).render("error", { error: e, status: 404 });
    }

    if (!req || !req.body) {
      const strError =
        "This error occurred because in the /recommend route, it had no req body.";
      return res.status(400).render("error", { error: strError, auth: true }); //number is good
    }
    let courtList;
    try {
      courtList = await getAllCourts();
    } catch (e) {
      return res.status(500).render("error", { error: e, status: 500 });
    }
    let user;
    try {
      user = await getUserById(req.session.user.id);
    } catch (e) {
      return res.status(500).render("error", { error: e, status: 500 });
    }
    let zip = req.session.user.zip;
    courtList.map((court) => {
      court.distance =
        Math.floor(zipCodeDistance(zip, court.zip, "M") * 10) / 10;
    });
    //console.log(zipCodeDistance(zip, "07030", "M"));
    //console.log(courtList);
    courtList = courtList.filter((court) => {
      return court.distance <= 100;
    });
    courtList.sort((a, b) => {
      if (a.distance < b.distance) {
        return -1;
      }
      if (a.distance > b.distance) {
        return 1;
      }
      return 0;
    });
    courtList.map((court) => {
      if (court.distance <= 1) court.distance = "Within 1 Mile";
      else {
        court.distance = `${court.distance} Miles Away`;
      }
    });
    console.log("AFTER MAP2");
    courtList = courtList.filter((court) => {
      return court.type.localeCompare(xss(req.body.courtType)) == 0;
    });
    //experience level checker algorithm
    let expLevelPercent = 0;
    let expLevelCounter = 0;
    let numberOfBookingsCounter = 0;
    let updatedCourtList = [];
    let listOfCourtsPairedWithPercent = [];
    let sixMonthMark = moment().add(6, "months");
    //console.log(sixMonthMark);
    //sixMonthMark = sixMonthMark.format('MM/DD/YYYY');
    try {
      for (
        let i = 0;
        i < courtList.length;
        i++ //for each court
      ) {
        let currentDate = moment();
        while (currentDate.isSameOrBefore(sixMonthMark)) {
          //iterate all dates
          let currentDateStr = currentDate.format("MM/DD/YYYY").toString();
          if (courtList[i].schedule.hasOwnProperty(currentDateStr) == true) {
            for (
              let j = 0;
              j < courtList[i].schedule[currentDateStr].length;
              j++ //iterate through a date array of bookings
            ) {
              let currentUserId =
                courtList[i].schedule[currentDateStr][j].userId;
              let iterationUser;
              try {
                iterationUser = await getUserById(currentUserId);
              } catch (e) {
                return res
                  .status(500)
                  .render("error", { error: e, status: 500 });
              }
              if (
                iterationUser.experience_level.localeCompare(
                  user.experience_level
                ) == 0
              ) {
                //expLevelCounter++;
                expLevelCounter =
                  courtList[i].schedule[currentDateStr][j].capacity +
                  expLevelCounter;
              }
              //numberOfBookingsCounter++;
              numberOfBookingsCounter =
                courtList[i].schedule[currentDateStr][j].capacity +
                numberOfBookingsCounter;
            } //end single date iteration of bookings
          }
          currentDate = currentDate.add(1, "day");
        } //end 6 month iteration

        if (numberOfBookingsCounter != 0) {
          expLevelPercent =
            (expLevelCounter / parseFloat(numberOfBookingsCounter)) * 100;
        }
        if (expLevelPercent >= 50) {
          expLevelPercent = Math.round(expLevelPercent);
          courtList[i].percent = expLevelPercent;
          courtList[i].expLvl = user.experience_level;
          updatedCourtList.push(courtList[i]);
        }
        expLevelCounter = 0;
        numberOfBookingsCounter = 0;
        expLevelPercent = 0;
      } //end of each court
    } catch (e) {
      console.log(e);
      return res.status(500).render("error", { error: e, auth: true }); //number is good
    }

    return res.render("recommendedCourts", {
      title: "Recommend Courts",
      courts: updatedCourtList,
      auth: true,
      id: req.session.user.id,
      owner: req.session.user.owner,
      experienceLevel: user.experience_level,
      courtType: xss(req.body.courtType),
      apiKey: process.env.MAPS_API_KEY,
      submitted: true,
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

  let schedExists = false;
  if (Object.keys(schedule).length > 0) {
    schedExists = true;
  }
  // console.log(schedule)
  // console.log(Object.keys(schedule).length )

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
    scheduleExists: schedExists,
    totalCapacity: thisCourt.capacity,
  });
});

router
  .route("/:courtId/reserve")
  .get(async (req, res) => {
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
      id: req.session.user.id,
      mindate: currentDateStr,
      maxdate: maxDateStr,
      schedule: thisCourt.schedule,
      owner: req.session.user.owner,
    });
  })
  .post(async (req, res) => {
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

    let newDateStr;
    let newCap;
    try {
      //console.log("Validations");
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
      req.session.user.id = validId(
        req.session.user.id,
        "user ID from req.session"
      );
      //console.log(req.session.user.id);

      let dateArr = xss(req.body.selectedDate).split("-");
      newDateStr = dateArr[1] + "/" + dateArr[2] + "/" + dateArr[0];
      newDateStr = validDate(newDateStr);

      req.body.startTime = validTime(xss(req.body.startTime), false);
      req.body.endTime = validTime(xss(req.body.endTime), true);

      validTimeInRange(
        xss(req.body.startTime),
        xss(req.body.endTime),
        thisCourt.courtOpening,
        thisCourt.courtClosing
      );

      for (let i = 0; i < xss(req.body.capacity.length); i++) {
        if (
          xss(req.body.capacity.charCodeAt(i)) < 48 ||
          xss(req.body.capacity.charCodeAt(i)) > 57
        ) {
          throw `Error: capacity must contain all digits`;
        }
      }
      newCap = parseInt(xss(req.body.capacity));
      newCap = validNumber(
        newCap,
        "number of players",
        true,
        0,
        thisCourt.capacity
      );
    } catch (e) {
      //const strError = e;
      //return res.status(404).json({ error: e });
      return res.status(404).render("makeReservation", {
        error: e,
        auth: true,
        title: `Reserve ${thisCourt.name}`,
        court: thisCourt,
        id: req.session.user.id,
        mindate: currentDateStr,
        maxdate: maxDateStr,
        schedule: thisCourt.schedule,
        owner: req.session.user.owner,
      });
    }

    try {
      //schedule data call
      let addedToSchedule = await addToSchedule(
        req.params.courtId, //courtId,
        req.session.user.id,
        newDateStr,
        xss(req.body.startTime),
        xss(req.body.endTime),
        newCap
      );
    } catch (e) {
      console.log("Error on schedule data call");
      //return res.status(404).json({ error: e });
      return res.status(404).render("makeReservation", {
        error: e,
        auth: true,
        title: `Reserve ${thisCourt.name}`,
        court: thisCourt,
        id: req.session.user.id,
        mindate: currentDateStr,
        maxdate: maxDateStr,
        schedule: thisCourt.schedule,
        owner: req.session.user.owner,
      });
      //return res.status(404).render('error', {error: strError});
    }
    try {
      //history data call
      let addedToHistory = await appendToHistory(
        //(userId, courtId, date, startTime, endTime)
        req.session.user.id,
        req.params.courtId, //courtId,
        newDateStr,
        xss(req.body.startTime),
        xss(req.body.endTime)
      );
    } catch (e) {
      console.log("Error on history data call");
      //return res.status(404).json({ error: e });
      return res.status(404).render("makeReservation", {
        error: e,
        auth: true,
        title: `Reserve ${thisCourt.name}`,
        court: thisCourt,
        id: req.session.user.id,
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
      id: req.session.user.id,
      mindate: currentDateStr,
      maxdate: maxDateStr,
      schedule: thisCourt.schedule,
      owner: req.session.user.owner,
      reserveDate: newDateStr,
      startTime: xss(req.body.startTime),
      endTime: xss(req.body.endTime),
      bookedForNumber: newCap,
    });
  });

router.route("/:courtId/:historyId/cancel").get(async (req, res) => {
  // console.log("CANCEL!!!");
  //remove from history and schedule
  try {
    let date = (await getHistoryItem(req.params.historyId)).date;
    await deleteHistoryItem(req.params.historyId);
    // console.log("history " + req.params.historyId);
    await removeFromSchedule(req.params.courtId, req.session.user.id, date);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Your booking was not successfully cancelled, please try again.",
    });
  }
  return res.redirect("back");
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
      const strError =
        "This error occurred in the /:courtId/editCourt route because a court with the supplied id does not exist.";
      return res.status(404).json({ error: strError });
    }
    return res.render("editCourt", {
      auth: isAuth,
      courtName: thisCourt.name,
      capacity: thisCourt.capacity,
      opening: thisCourt.courtOpening,
      closing: thisCourt.courtClosing,
      courtId: req.params.courtId,
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
        bad: e,
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
        bad: e,
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
        bad: e,
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
        bad: e,
      });
    }
    updatedCourt["id"] = thisCourt._id;
    updatedCourt["ownerId"] = thisCourt.ownerId;
    try {
      let finalCourt = await updateCourt(
        updatedCourt.id,
        name,
        capacity,
        courtOpening,
        courtClosing,
        updatedCourt.ownerId
      );
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
        bad: e,
      });
    }
  });

router.route("/:courtId/editCourt/deleting").post(async (req, res) => {
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
      bad: e,
    });
  }
  try {
    let deleted = await deleteCourt(req.params.courtId);
    if (deleted) {
      res.redirect("/");
    }
  } catch (e) {
    return res.render("editCourt", {
      auth: isAuth,
      courtName: thisCourt.name,
      capacity: thisCourt.capacity,
      opening: thisCourt.courtOpening,
      closing: thisCourt.courtClosing,
      bad: e,
    });
  }
});

export default router;
