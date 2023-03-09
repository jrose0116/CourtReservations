import userRoutes from "./users.js";
import courtRoutes from "./courts.js";
import groupRoutes from "./groups.js";
import utilRoutes from "./utils.js";
// import adminRoutes from "./admin.js";

const constructor = (app) => {
  app.get("/", (req, res) => res.json({ route: "Here" }));

  app.use("/", utilRoutes); // TODO: Handles settings, search, history, recommendations (Without actually using the '/' route)

  app.use("/user", userRoutes); // TODO: Handle own profile, other user profiles, reviews, etc.
  app.use("/court", courtRoutes); // TODO: Handle courts, court listings (book, cancel, rate), etc.
  app.use("/group", groupRoutes); // TODO: Handle groups

  // app.use("/admin", adminRoutes); // TODO: Handle potential admin dashboard. Ability to verify profiles and remove listings, groups, etc.

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

export default constructor;
