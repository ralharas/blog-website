import express from "express";

const router = express.Router();

let posts = [];

router.get("/", (req, res) => {
    res.render("index", { posts });
})

router.get("/explore", (req, res) => {
    res.render("explore");
})

router.get("/new-post", (req, res) => {
    res.render("new-post");
})


router.post("/new-post", (req, res) => {
    const { title, description, content } = req.body;
    const newPost = {
        id: posts.length + 1,
        title,
        description,
        content
    };
    posts.push(newPost);
    res.redirect(`/post/${newPost.id}`);
});

router.get("/post/:id", (req, res) => {
    const post = posts.find(p => p.id == req.params.id);
    if (post) {
        res.render("post", { post });
    } else {
        res.status(404).send("Post not found");
    }
});



router.get("/signin", (req, res) => {
    res.render("signin");
})

router.get("/signup", (req, res) => {
    res.render("signup");
})
export default router;