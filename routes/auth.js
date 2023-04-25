import { Router } from "express";
import { createUser, checkUser } from "../data/users.js";
const router = Router();
// import { users } from "../config/mongoCollections.js";
import { validStr } from "../validation.js";

router
  .route("/login")
  .get(async (req, res) => {
    return res.render("login", {});
  })
  .post(async (req, res) => {
    let emailAddress, password;
    try {
      emailAddress = validStr(
        req.body.emailAddressInput,
        "Email"
      ).toLowerCase();
      password = validStr(req.body.passwordInput, "Password");
      if (password.length != req.body.passwordInput.length)
        throw "Password must not contain whitespace.";
      if (password.length < 8)
        throw "Password must be at least 8 characters long";
      if (
        !/^[a-z0-9]+([._\-][a-z0-9]+)*@[a-z0-9]+(-[a-z0-9]+)*[a-z0-9]*\.[a-z0-9]+[a-z0-9]+$/.test(
          emailAddress
        ) ||
        emailAddress.length > 320
      )
        throw "Invalid email address format";
      let passUpper = false;
      let passNumber = false;
      let passSpecial = false;
      for (let i of password) {
        if (i == " ") throw "Password must not contain spaces";
        if (/[A-Z]/.test(i)) passUpper = true;
        else if (/[0-9]/.test(i)) passNumber = true;
        else if (/[!@#$%^&*\(\)-_+=\[\]\{\}\\\|;:'",<.>\/?]/.test(i))
          passSpecial = true;
        else if (!/[a-z]/.test(i)) throw "Password contains invalid characters";
      }
      if (!passUpper || !passNumber || !passSpecial)
        throw "Password must contain an uppercase character, number, and special character";
    } catch (e) {
      return res
        .status(400)
        .render("login", { auth: false, message: e, error: true });
    }

    try {
      let user = await checkUser(emailAddress, password);
      //cookie
      //   const userCollection = await users();
      // let user = await userCollection.findOne({ email: emailAddressInput });
      //   req.session.user = {
      //     id: user._id.toString(),
      //     firstName: user.firstName,
      //     lastName: user.lastName,
      //     emailAddress: user.emailAddress,
      //     isOwner: user.owner,
      //   };
      req.session.user = user;
      //   res.cookie("AuthCookie", req.session.sessionID);
      if (req.session.user.owner === true) {
        return res.redirect("/courts/create");
      } else {
        return res.redirect("/courts/available");
      }
    } catch (e) {
      return res
        .status(400)
        .render("login", { message: e, error: true, auth: false });
    }
  });

router.route("/register").get(async (req, res) => {
  return res.render("register", { auth: false });
});

router.route("/logout").get(async (req, res) => {
  req.session.destroy();
  return res.render("logout", { auth: false });
});

export default router;
