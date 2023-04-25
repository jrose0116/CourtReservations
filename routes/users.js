import { Router } from "express";
const router = Router();
import {
  createUser,
  getUserById,
  getUserByName,
  getUserByUsername,
  updateUser,
} from "../data/users.js";
import { createReview } from "../data/reviews.js";
import { getHistory } from "../data/history.js";
import { getCourtById } from "../data/courts.js";
import { validId, validStr } from "../validation.js";

router.route("/id/:userId").get(async (req, res) => {
  let userId;
  try {
    userId = validId(req.params.userId);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    let user = await getUserById(req.params.userId);
    return res.render("profilePage", {
      id: req.session.user.id,
      title: req.params.username,
      user: user,
      reviews: user.reviews,
      auth: true,
    });
  } catch (e) {
    return res.status(404).json({ error: "User not found" });
  }
  //return res.json({ userId: req.params.userId, implementMe: "<-" });
});

router
  .route("/id/:userId/createReview")
  .get(async (req, res) => {
    let userId;
    try {
      userId = validId(req.params.userId);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    let user;
    try {
      user = await getUserById(userId);
    } catch (e) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.render("createReview", {
      title: req.params.username,
      user: user,
      id: req.session.user.id,
      auth: true,
    });
  })
  .post(async (req, res) => {
    let reviewerId, revieweeId;
    try {
      reviewerId = validId(req.session.user.id);
      revieweeId = validId(req.params.userId);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    let reviewee, reviewer;
    try {
      reviewer = await getUserById(req.session.user.id);
      reviewee = await getUserById(req.params.userId);
    } catch (e) {
      return res.status(404).json({ error: e });
    }
    let reviewInfo = req.body;
    reviewInfo["reviewer_id"] = req.session.user.id;
    reviewInfo["reviewee_id"] = reviewee._id;
    try {
      let review = await createReview(
        reviewInfo.reviewee_id,
        reviewInfo.reviewer_id,
        Number(reviewInfo.rating),
        reviewInfo.comment
      );
      if (review) {
        return res.redirect(`/user/id/${revieweeId}`);
      }
    } catch (e) {
      return res.status(400).render("createReview", { bad: e });
    }
    /*try {
      let review = await createReview(reviewInfo.reviewee_id, reviewInfo.reviewer_id, reviewInfo.rating, reviewInfo.comment);
       res.json({ create: reviewInfo });
    } catch (e) {
        return res.status(400).render('createReview', {bad: e});
    }
    res.status(500).render("createReview", { bad: "Internal Server Error" });*/
  });

/*router.route("/id/:userId/createReview").post(async(req, res) => {
  let newReview = await createReview(req.body);
  res.render('profilePage', { title: req.params.username, user: user, reviews: user.reviews});
})*/

router.route("/name/:username").get(async (req, res) => {
  let usernameInput;
  try {
    usernameInput = validStr(usernameInput, "username");
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  let user = await getUserByUsername(usernameInput);
  if (user === null) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.redirect("/id/" + user._id);
  //return res.json({ username: req.params.username, implementMe: "<-" });
});

router.route("/id/:userId/history").get(async (req, res) => {
  let userId;
  try {
    userId = validId(req.params.userId);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  let courtHistory = await getHistory(userId);
  for (let i = 0; i < courtHistory.length; i++) {
    let court = await getCourtById(courtHistory[i].court_id);
    courtHistory[i].court_name = court.name;
  }
  // console.log(courtHistory)
  // let link = `/user/id/${req.params.userId}/`;
  return res.render("history", {
    auth: true,
    title: "History",
    courts: courtHistory,
    id: req.params.userId,
  });
});

export default router;
