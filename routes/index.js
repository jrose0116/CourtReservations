import userRoutes from "./users.js";
import courtRoutes from "./courts.js";
import groupRoutes from "./groups.js";
import authRoutes from "./auth.js";
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

  app.use("*", (req, res) => {
    res.redirect("/");
  });
};

export default constructor;
