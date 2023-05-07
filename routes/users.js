import { Router } from "express";
const router = Router();
import multer from "multer";
import { ObjectId } from "mongodb";
const upload = multer({ dest: "public/images" });
import fs from "fs";
import {
  createUser,
  getUserById,
  getUserByName,
  getUserByUsername,
  updateUser,
} from "../data/users.js";
import { createReview } from "../data/reviews.js";
import { getHistory } from "../data/history.js";
import { getCourtById, checkIfOwner } from "../data/courts.js";
import {
  validExpLevel,
  validId,
  validState,
  validStr,
  validZip,
} from "../validation.js";
import { getAllUsers } from "../data/users.js";

router
  .route("/id/:userId/createReview")
  .get(async (req, res) => {
    let userId, currentId;
    try {
      userId = validId(req.params.userId);
      currentId = validId(req.session.user.id);
      if (userId == currentId) throw "Cannot review your own profile";
    } catch (e) {
      return res.status(400).render("error", {
        error: e,
        auth: true,
        status: 400,
        //owner: req.session.user.owner,
        id: req.session.user.id,
      });
    }
    let user;
    try {
      user = await getUserById(userId);
    } catch (e) {
      return res.status(404).render("error", {
        error: "User not found",
        auth: true,
        status: 404,
        //owner: req.session.user.owner,
        id: req.session.user.id,
      });
    }
    return res.render("createReview", {
      title: req.params.username,
      user: user,
      auth: true,
      //owner: req.session.user.owner,
      id: req.session.user.id,
    });
  })
  .post(async (req, res) => {
    let reviewerId, revieweeId;
    try {
      reviewerId = validId(req.session.user.id);
      revieweeId = validId(req.params.userId);
      if (reviewerId == revieweeId) throw "Cannot cast review onto own profile";
    } catch (e) {
      return res.status(400).render("error", {
        error: e,
        auth: true,
        status: 400,
        //owner: req.session.user.owner,
        id: req.session.user.id,
      });
    }
    let reviewee, reviewer;
    try {
      reviewer = await getUserById(reviewerId);
      reviewee = await getUserById(revieweeId);
    } catch (e) {
      return res.status(404).render("error", {
        error: e,
        auth: true,
        status: 404,
        //owner: req.session.user.owner,
        id: req.session.user.id,
      });
    }
    let reviewInfo = req.body;
    reviewInfo["reviewer_id"] = reviewerId;
    reviewInfo["reviewee_id"] = revieweeId;
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
      return res.status(400).render("createReview", {
        error: e,
        auth: true,
        //owner: req.session.user.owner,
        id: req.session.user.id,
      });
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
    return res.status(400).render("error", {
      error: e,
      auth: true,
      status: 400,
      //owner: req.session.user.owner,
      id: req.session.user.id,
    });
  }
  let user = await getUserByUsername(usernameInput);
  if (user === null) {
    return res.status(404).render("error", {
      error: "User not found",
      auth: true,
      status: 404,
      //owner: req.session.user.owner,
      id: req.session.user.id,
    });
  }
  return res.redirect("/id/" + user._id);
  //return res.json({ username: req.params.username, implementMe: "<-" });
});

router.route("/id/:userId/history").get(async (req, res) => {
  let userId;
  try {
    userId = validId(req.params.userId);
  } catch (e) {
    return res.status(400).render("error", {
      error: e,
      auth: true,
      status: 400,
      //owner: req.session.user.owner,
      id: req.session.user.id,
    });
  }
  let courtHistory;
  try {
    courtHistory = await getHistory(userId);
  } catch (e) {
    return res.status(404).render("error", {
      error: e,
      status: 404,
      auth: true,
      //owner: req.session.user.owner,
      id: req.session.user.id,
    });
  }
  for (let i = 0; i < courtHistory.length; i++) {
    let court;
    try {
      court = await getCourtById(courtHistory[i].court_id);
    } catch (e) {
      res.status(404).render("error", { error: e, status: 404, auth: true });
    }
    courtHistory[i].court_name = court.name;
  }
  // console.log(courtHistory)
  // let link = `/user/id/${req.params.userId}/`;
  return res.render("history", {
    auth: true,
    title: "History",
    courts: courtHistory,
    id: req.params.userId,
    //owner: req.session.user.owner,
  });
});

router.route("/id/:userId").get(async (req, res) => {
  let sessionId;
  let userId;
  let isOwner = await checkIfOwner(req.params.userId);
  try {
    userId = validId(req.params.userId);
    sessionId = validId(req.session.user.id);
  } catch (e) {
    return res
      .status(400)
      .render("error", { error: e, auth: true, status: 400 });
  }
  try {
    let user = await getUserById(req.params.userId);
    return res.render("profilePage", {
      id: req.session.user.id,
      title: req.params.username,
      user: user,
      reviews: user.reviews,
      auth: true,
      ownPage: userId == sessionId,
      reviewcount: user.reviews.length,
      owner: isOwner,
    });
  } catch (e) {
    return res
      .status(404)
      .render("error", { error: "User not found", auth: true, status: 404 });
  }
  //return res.json({ userId: req.params.userId, implementMe: "<-" });
});

router.route("/explore").get(async (req, res) => {
  let userList = await getAllUsers();
  //take current user out of userList
  userList = userList.filter((obj) => obj._id.toString() !== req.session.user.id);
  res.render("explore", {
    auth: true,
    users: userList,
    id: req.session.user.id,
  });
});

router
  .route("/id/:userId/editProfile")
  .get(async (req, res) => {
    let thisUser = await getUserById(req.params.userId);
    res.render("editProfile", {
      auth: true,
      //owner: req.session.user.owner,
      id: req.session.user.id,
      email: thisUser.email,
      state: thisUser.state,
      city: thisUser.city,
      zip: thisUser.zip,
      level: thisUser.experience_level,
    });
  })
  .post(upload.single("userImage"), async (req, res) => {
    let updatedUser = req.body;
    let fileData = req.file;
    let currentUser = await getUserById(req.params.userId);
    if (fileData) {
      fs.readFile(fileData.path, function (err, data) {
        if (err) throw err;
        fs.writeFile(
          "public/images/" + fileData.originalname,
          data,
          function (err) {
            if (err) throw err;
          }
        );
      });
      updatedUser["userImage"] = "/public/images/" + fileData.originalname;
    } else {
      updatedUser["userImage"] = currentUser.image;
    }
    let thisUser;
    let isAuth;
    if (req.session.user) {
      isAuth = true;
    } else {
      isAuth = false;
    }

    try {
      thisUser = await getUserById(req.params.userId);
    } catch (e) {
      return res.render("editProfile", {
        auth: isAuth,
       // owner: req.session.user.owner,
        id: req.session.user.id,
        email: thisUser.email,
        state: thisUser.state,
        city: thisUser.city,
        zip: thisUser.zip,
        level: thisUser.experience_level,
        bad: e,
      });
    }
    let newCity, newState, newZip, newLevel, newOwner;
    try {
      newCity = validStr(updatedUser.cityInput);
    } catch (e) {
      return res.render("editProfile", {
        auth: isAuth,
        //owner: req.session.user.owner,
        id: req.session.user.id,
        email: thisUser.email,
        state: thisUser.state,
        city: thisUser.city,
        zip: thisUser.zip,
        level: thisUser.experience_level,
        bad: e,
      });
    }
    try {
      newState = validState(updatedUser.stateInput);
    } catch (e) {
      return res.render("editProfile", {
        auth: isAuth,
       // owner: req.session.user.owner,
        id: req.session.user.id,
        email: thisUser.email,
        state: thisUser.state,
        city: thisUser.city,
        zip: thisUser.zip,
        level: thisUser.experience_level,
        bad: e,
      });
    }
    try {
      newZip = validZip(updatedUser.zipInput);
    } catch (e) {
      return res.render("editProfile", {
        auth: isAuth,
       // owner: req.session.user.owner,
        id: req.session.user.id,
        email: thisUser.email,
        state: thisUser.state,
        city: thisUser.city,
        zip: thisUser.zip,
        level: thisUser.experience_level,
        bad: e,
      });
    }
    try {
      newLevel = validExpLevel(updatedUser.levelInput);
    } catch (e) {
      return res.render("editProfile", {
        auth: isAuth,
       // owner: req.session.user.owner,
        id: req.session.user.id,
        email: thisUser.email,
        state: thisUser.state,
        city: thisUser.city,
        zip: thisUser.zip,
        level: thisUser.experience_level,
        bad: e,
      });
    }

    try {
      let finalUser = await updateUser(
        req.params.userId,
        thisUser.firstName,
        thisUser.lastName,
        thisUser.username,
        thisUser.age,
        newCity,
        newState,
        newZip,
        updatedUser.emailAddressInput,
        newLevel,
        //thisUser.owner,
        updatedUser.userImage
      );
      if (finalUser) {
        res.redirect(`/user/id/${req.params.userId}`);
      }
    } catch (e) {
      return res.render("editProfile", {
        auth: isAuth,
        //owner: req.session.user.owner,
        id: req.session.user.id,
        email: thisUser.email,
        state: thisUser.state,
        city: thisUser.city,
        zip: thisUser.zip,
        level: thisUser.experience_level,
        bad: e,
      });
    }
  });

export default router;
