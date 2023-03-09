import { Router } from "express";
const router = Router();

router.route("/search").get((req, res) => {
  return res.json({ search: "here", implementMe: "<-" });
});

router.route("/:groupId").get((req, res) => {
  return res.json({ groupId: req.params.groupId, implementMe: "<-" });
});

export default router;
