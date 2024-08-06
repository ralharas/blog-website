import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.render("index");
})

router.get("/explore", (req, res) => {
    res.render("explore");
})

router.get("/new-post", (req, res) => {
    res.render("new-post");
})

router.get("/signin", (req, res) => {
    res.render("signin");
})

export default router;