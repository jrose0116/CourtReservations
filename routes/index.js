import userRoutes from "./users.js";
import courtRoutes from "./courts.js";
import groupRoutes from "./groups.js";
import authRoutes from "./auth.js";
import { getAllCourts, checkIfOwner } from "../data/courts.js";

const constructor = (app) => {
  app.use("/", authRoutes);
  app.use("/user", userRoutes); // TODO: Handle own profile, other user profiles, reviews, etc.
  app.use("/courts", courtRoutes); // TODO: Handle courts, court listings (book, cancel, rate), etc.
  app.use("/group", groupRoutes); // TODO: Handle groups

  app.get("/", async (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.id) {
      return res.render("homepage", { auth: false, title: "Home" });
    }
    let isOwner = await checkIfOwner(req.session.user.id);
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
      owner: isOwner,
    });
  });

  app.use("*", (req, res) => {
    return res.redirect("/");
  });
};

export default constructor;
