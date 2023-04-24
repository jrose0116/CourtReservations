import { Router } from "express";
const router = Router();

router.patch("/login", (req, res) => {
  res.json({ verified: "true?", user: req.params.userId });
});

router.patch("/register", (req, res) => {
    res.json({ verified: "true?", user: req.params.userId });
});

router.patch("/logout", (req, res) => {
res.json({ verified: "true?", user: req.params.userId });
});

export default router;
