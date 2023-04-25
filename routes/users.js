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

router.route("/id/:userId").get(async (req, res) => {
  try {
    // let isAuth;
    // if (req.session.user) {
    //   isAuth = true;
    // } else {
    //   isAuth = false;
    // }
    let user = await getUserById(req.params.userId);
    res.render("profilePage", {
      id: req.session.user.id,
      title: req.params.username,
      user: user,
      reviews: user.reviews,
      auth: true,
    });
  } catch (e) {
    res.status(404).json({ error: "user not found" });
  }
  //return res.json({ userId: req.params.userId, implementMe: "<-" });
});

router
  .route("/id/:userId/createReview")
  .get(async (req, res) => {
    let isAuth;
    if (req.session.user) {
      isAuth = true;
    } else {
      isAuth = false;
    }
    let user = await getUserById(req.params.userId);
    res.render("createReview", {
      title: req.params.username,
      user: user,
      id: req.session.user.id,
      auth: isAuth,
    });
  })
  .post(async (req, res) => {
    let reviewee = await getUserById(req.params.userId);
    let reviewInfo = req.body;
    let reviewer = await getUserById(req.session.user.id);
    reviewInfo["reviewer_id"] = req.session.user.id;
    reviewInfo["reviewerUsername"] = reviewer.username;
    reviewInfo["revieweeUsername"] = reviewee.username;
    reviewInfo["reviewee_id"] = reviewee._id;
    try {
      let review = await createReview(
        reviewInfo.reviewee_id,
        reviewInfo.reviewer_id,
        Number(reviewInfo.rating),
        reviewInfo.comment
      );
      if (review) {
        return res.redirect(`/user/id/${reviewInfo.reviewee_id}`);
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
  let username = await getUserByUsername(req.params.username);
  return res.json({ username });
  //return res.json({ username: req.params.username, implementMe: "<-" });
});

router.route("/id/:userId/history").get(async (req, res) => {
  let courtHistory = await getHistory(req.params.userId);
  console.log(courtHistory);
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
