import userRoutes from "./users.js";
import courtRoutes from "./courts.js";
import groupRoutes from "./groups.js";
import authRoutes from "./auth.js";
import { getAllCourts } from "../data/courts.js";
// import utilRoutes from "./utils.js";
// import adminRoutes from "./admin.js";

const constructor = (app) => {
  // app.get("/", (req, res) => res.json({ route: "Landing Page or Sign Up" })); // TODO: Remember Internet Laws
  app.use("/", authRoutes);
  // app.use("/", utilRoutes); // TODO: Handles settings, search, history, recommendations (Without actually using the '/' route)

  app.use("/user", userRoutes); // TODO: Handle own profile, other user profiles, reviews, etc.
  app.use("/courts", courtRoutes); // TODO: Handle courts, court listings (book, cancel, rate), etc.
  app.use("/group", groupRoutes); // TODO: Handle groups

  // app.use("/admin", adminRoutes); // TODO: Handle potential admin dashboard. Ability to verify profiles and remove listings, groups, etc.

  app.get("/", async (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.id) {
      return res.render("homepage", { auth: false, title: "Home" });
    }
    let courtList;
    try {
      courtList = await getAllCourts();
    } catch (e) {
      return res.status(500).render("error", { error: e, status: 500 });
    }
    let ownedList = courtList.filter((court) => {
      return court.ownerId == req.session.user.id;
    });
    // courtList = courtList.filter((court) => {
    //   return court.ownerId != req.session.user.id;
    // });
    return res.render("homepage", {
      auth: true,
      title: "Home",
      availableCourts: courtList,
      ownedCourts: ownedList,
      id: req.session.user.id,
      owner: req.session.user.owner,
    });
  });

  app.use("*", (req, res) => {
    return res.redirect("/");
  });
};

export default constructor;
