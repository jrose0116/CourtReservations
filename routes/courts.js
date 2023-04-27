import { Router } from "express";
import { zipCodeDistance } from "zipcode-city-distance";

const router = Router();
import {
  createCourt,
  getCourtById,
  getAllCourts,
  getCourtsByName,
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

router.route("/available").get(async (req, res) => {
  let courtList;
  try {
    courtList = await getAllCourts();
  } catch (e) {
    return res.status(500).render("error", { error: e, status: 500 });
  }
  //   let isAuth;
  //   if (req.session.user) {
  //     isAuth = true;
  //   } else {
  //     isAuth = false;
  //   }
  let zip = req.session.user.zip;
  courtList.map((court) => {
    court.distance = Math.floor(zipCodeDistance(zip, court.zip, "M") * 10) / 10;
  });
  courtList = courtList.filter((court) => {
    console.log(court.distance <= 25);
    return court.distance <= 25;
  });
  courtList.map((court) => {
    if (court.distance <= 1) court.distance = "Within 1 Mile";
    else {
      court.distance = `${court.distance} Miles Away`;
    }
  });
  return res.render("allCourts", {
    title: "Courts",
    courts: courtList,
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
    thisCourt = await getCourtById(req.params.courtId);
  } catch (e) {
    return res.status(404).render("error", { error: e, status: 404 });
  }
  return res.render("courtById", {
    auth: true,
    title: thisCourt.name,
    court: thisCourt,
    id: req.session.user.id,
    owner: req.session.user.owner,
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
  //TODO:userId validation
  let thisCourt;
  try {
    //get court
    req.params.courtId = validId(req.params.courtId);
    thisCourt = await getCourtById(req.params.courtId);
  } catch (e) {
    const strError =
      "This error occurred in the /:courtId/reserve route because a court with the supplied id does not exist. Click a link on the court by id page to avoid this issue.";
    return res.status(404).json({ error: strError });
    //return res.status(404).render('error', {error: strError});
  }
  try {
    //validations
    if (!req || !req.body) {
      const strError =
        "This error occurred because in the /:courtId/reserve route, it had no req body.";
      return res.status(400).render("error", { error: strError, auth: true }); //number is good
    }

    //userId = validId(userId);

    let dateArr = req.body.selectedDate.split("-");
    let newDateStr = dateArr[1] + "/" + dateArr[2] + "/" + dateArr[0];
    newDateStr = validDate(newDateStr);

    req.body.startTime = validTime(req.body.startTime);
    req.body.endTime = validTime(req.body.endTime);

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
    let newCap = parseInt(req.body.capacity);
    newCap = validNumber(newCap, "capacity", true, 0, thisCourt.capacity);
  } catch (e) {
    //const strError = "";
    return res.status(404).json({ error: e });
  }

  try {
    //data call
    console.log("data call");
    // let addedToSchedule = await addToSchedule(
    // 	courtId,
    // 	userId,//<-- issue b/c not yet validated
    // 	newDateStr,
    // 	req.body.startTime,
    // 	req.body.endTime,
    // 	newCap);
  } catch (e) {
    return res.status(404).json({ error: e });
    //return res.status(404).render('error', {error: strError});
  }

  try {
    //data call
    // console.log("data call")
    // let addedToSchedule = await addToSchedule(
    // 	courtId,
    // 	userId,//<-- issue b/c not yet validated
    // 	newDateStr,
    // 	req.body.startTime,
    // 	req.body.endTime,
    // 	newCap);
  } catch (e) {
    return res.status(404).json({ error: e });
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
  });
});

// router.route("/:courtId/cancel").get((req, res) => {
//   return res.json({
//     courtId: req.params.courtId,
//     cancel: "this",
//     implementMe: "<-",
//   });
// });

export default router;
