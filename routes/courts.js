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
  return res.render('../views/makeReservation', {title: 'Make Reservation', court: thisCourt, id: thisCourt._id});
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
