import { Router } from "express";
const router = Router();

router.route("/login").get(async (req, res) => {
    return res.render('../views/login', {});
});

router.route("/register").get(async (req, res) => {
    return res.render('../views/register', {});
});

router.route("/logout").get(async (req, res) => {
    return res.render('../views/logout', {});
});

export default router;
