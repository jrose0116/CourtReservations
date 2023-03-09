import { Router } from "express";
const router = Router();

router.get("/testutil", (req, res) => {
  res.json({ test: "util", implementMe: "<-" });
});

export default router;
