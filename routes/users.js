import { Router } from "express";
const router = Router();

router.route("/id/:userId").get((req, res) => {
  return res.json({ userId: req.params.userId, implementMe: "<-" });
});

router.route("/name/:username").get((req, res) => {
  return res.json({ username: req.params.username, implementMe: "<-" });
});

export default router;
