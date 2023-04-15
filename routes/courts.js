import { Router } from "express";
const router = Router();

router.route("/list/").get(async (req, res) => {
  // return res.json({ route: "Available courts page" });
  return res.render('../views/allCourts', {title: 'Available Courts'});
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

router.route("/:courtId/reserve").get((req, res) => {
  return res.json({
    courtId: req.params.courtId,
    reserve: "this",
    implementMe: "<-",
  });
});

router.route("/:courtId/cancel").get((req, res) => {
  return res.json({
    courtId: req.params.courtId,
    cancel: "this",
    implementMe: "<-",
  });
});

router.route("/:courtId/").get((req, res) => {
  return res.json({ courtId: req.params.courtId, implementMe: "<-" });
});

export default router;
