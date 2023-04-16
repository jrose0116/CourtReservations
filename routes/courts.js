import { Router } from "express";
const router = Router();
import {createCourt, getCourtById, getAllCourts, getCourtsByName} from '../data/courts.js';

router.route("/available/").get(async (req, res) => {
  let courtList = await getAllCourts();
  return res.render('../views/allCourts', {title: 'Available Courts', courts: courtList});
});

router.route("/:courtId/").get(async (req, res) => {
  let thisCourt = await getCourtById(req.params.courtId);
  return res.render('../views/courtById', {title: thisCourt.name, court: thisCourt});
});

router.route("/:courtId/reserve").get(async (req, res) => {
  let thisCourt = await getCourtById(req.params.courtId);

  var currentDate = new Date();
  var year = currentDate.getFullYear();
  var month = String(currentDate.getMonth() + 1).padStart(2, '0');
  var day = String(currentDate.getDate()).padStart(2, '0');
  var currentDateStr = year + '-' + month + '-' + day;

  var maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 1);
  var maxYear = maxDate.getFullYear();
  var maxMonth = String(maxDate.getMonth() + 1).padStart(2, '0');
  var maxDay = String(maxDate.getDate()).padStart(2, '0');
  var maxDateStr = maxYear + '-' + maxMonth + '-' + maxDay;

  return res.render('../views/makeReservation', {title: `Reserve ${thisCourt.name}`, court: thisCourt, id: thisCourt._id, mindate: currentDateStr, maxdate: maxDateStr });
});

router.route("/recommend/").get((req, res) => {
  return res.json({ route: "Recommended courts page" });
});

router
  .route("/create/")
  .get((req, res) => {
    return res.json({ route: "Create courts view" });
  })
  .post((req, res) => {
    return res.json({ create: "post" });
  });

// router.route("/:courtId/cancel").get((req, res) => {
//   return res.json({
//     courtId: req.params.courtId,
//     cancel: "this",
//     implementMe: "<-",
//   });
// });

export default router;
