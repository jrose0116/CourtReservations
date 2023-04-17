import { Router } from "express";
const router = Router();

router.get("/testutil", (req, res) => {
  res.json({ test: "util", implementMe: "<-" });
});

router.get("/history", (req, res) => {
  // let courtHistory = await
  return res.render('../views/history', {title: 'History', courts: courtHistory});
});

export default router;
