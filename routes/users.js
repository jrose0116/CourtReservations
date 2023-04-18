import { Router } from "express";
const router = Router();
import {createUser, getUserById, getUserByName, getUserByUsername, updateUser} from '../data/users.js';
import { createReview } from "../data/reviews.js";

router.route("/id/:userId").get(async (req, res) => {
  try {
    let user = await getUserById(req.params.userId);
    res.render('../views/profilePage', { title: req.params.username, user: user, reviews: user.reviews});
  } catch (e) {
    res.status(404).json({error: 'user not found'});
  }
  //return res.json({ userId: req.params.userId, implementMe: "<-" });
});

router.route("/id/:userId/createReview").get(async (req, res) => {
  let user = await getUserById(req.params.userId);
  res.render('../views/createReview', { title: req.params.username, user: user});
})

/*router.route("/id/:userId/createReview").post(async(req, res) => {
  let newReview = await createReview(req.body);
  res.render('../views/profilePage', { title: req.params.username, user: user, reviews: user.reviews});
})*/

router.route("/name/:username").get(async (req, res) => {
  let username = await getUserByUsername(req.params.username);
  return res.json({ username });
  //return res.json({ username: req.params.username, implementMe: "<-" });
});

export default router;
