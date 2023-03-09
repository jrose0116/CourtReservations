import { Router } from "express";
const router = Router();

router.patch("/verify/:userId", (req, res) => {
  res.json({ verified: "true?", user: req.params.userId });
});

export default router;
