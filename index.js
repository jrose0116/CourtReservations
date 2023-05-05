import express from "express";
import session from "express-session";
const app = express();
import configRoutes from "./routes/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import exphbs from "express-handlebars";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + "/public");

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: false,
  })
);

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  // let the next middleware run:
  next();
};

app.use("/public", staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.use("/login", (req, res, next) => {
  if (!req.session || !req.session.user) return next();
  return res.redirect("/");
});

app.use("/register", (req, res, next) => {
  if (!req.session || !req.session.user) return next();
  return res.redirect("/");
});

app.use("/", (req, res, next) => {
  console.log(req.method, req.originalUrl);
  if (
    req.originalUrl.substring(0, 6) != "/login" &&
    req.originalUrl.substring(0, 9) != "/register" &&
    req.originalUrl.substring(0, 9) != "/" &&
    (!req.session || !req.session.user)
  )
    return res.redirect("/");
  next();
});

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
