import { Router } from "express";
const router = Router();

router.route("/:courtId/reserve").get((req, res) => {
  return res.json({
    courtId: req.params.courtId,
    reserve: "this",
    implementMe: "<-",
  });
});

router.route("/:courtId/").get((req, res) => {
  return res.json({ courtId: req.params.courtId, implementMe: "<-" });
});

export default router;
