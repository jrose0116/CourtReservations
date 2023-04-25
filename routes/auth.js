import { Router } from "express";
import { createUser, checkUser } from "../data/users.js";
const router = Router();
import { users } from "../config/mongoCollections.js";

router
	.route("/login")
	.get(async (req, res) => {
		return res.render("login", {});
	})
	.post(async (req, res) => {
		let emailAddressInput = req.body.emailAddressInput;
		let passwordInput = req.body.passwordInput;

		// let errors = "";
		// let badInput = false;

		// if (!emailAddressInput || !passwordInput) {
		// 	errors += `Email and password must both be supplied`;
		// 	badInput = true;
		// }

		// try {
		// 	emailAddressInput = checkEmail(emailAddressInput);
		// 	passwordInput = checkPassword(passwordInput);
		// } catch (e) {
		// 	errors += `, ` + e;
		// 	badInput = true;
		// }

		// if (badInput) {
		// 	return res.status(400).render("login", { bad: errors });
		// }

		try {
			await checkUser(emailAddressInput, passwordInput);
			//cookie
			const userCollection = await users();
			let user = await userCollection.findOne({ email: emailAddressInput });
			req.session.user = {
				id: user._id.toString(),
				firstName: user.firstName,
				lastName: user.lastName,
				emailAddress: user.emailAddress,
				isOwner: user.owner,
			};
			res.cookie("AuthCookie", req.session.sessionID);
			if (req.session.user.isOwner === true) {
				return res.redirect("/courts/create");
			} else {
				return res.redirect("/courts/available");
			}
		} catch (e) {
			return res.status(400).render("login", { message: e, error: true });
		}
	});

router.route("/register").get(async (req, res) => {
	return res.render("register", {});
});

router.route("/logout").get(async (req, res) => {
    res.clearCookie('AuthCookie');
    req.session.destroy();
	return res.render("logout");
});

export default router;
