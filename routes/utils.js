import { Router } from "express";
const router = Router();

router.get("/testutil", (req, res) => {
  res.json({ test: "util", implementMe: "<-" });
});

router.get("/history", (req, res) => {
  res.json({ route: "History page" });
});

export default router;
