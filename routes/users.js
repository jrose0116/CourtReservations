import { Router } from "express";
const router = Router();
import {createUser, getUserById, getUserByName, getUserByUsername, updateUser} from '../data/users.js';

router.route("/id/:userId").get(async (req, res) => {
  try {
    let user = await getUserById(req.params.userId);
    res.render('../views/profilePage', {title: req.params.username, user: user, id: req.params.userId});
  } catch (e) {
    res.status(404).json({error: 'user not found'});
  }
  //return res.json({ userId: req.params.userId, implementMe: "<-" });
});

router.route("/name/:username").get(async (req, res) => {
  let username = await getUserByUsername(req.params.username);
  return res.json({ username });
  //return res.json({ username: req.params.username, implementMe: "<-" });
});

router.route("/id/:userId/history").get(async (req, res) => {
  let courtHistory = await getHistory(req.params.userId);
  // let link = `/user/id/${req.params.userId}/`;
  return res.render('../views/history', {title: 'History', courts: courtHistory, id: req.params.userId});
});

export default router;
