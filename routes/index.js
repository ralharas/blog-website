import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';

const router = express.Router();
let posts = [];
let postIdCounter = 1;
const images = ['beach.jpg', 'img1.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg', 'img6.jpg'];

router.get('/', (req, res) => {
    res.render('index', { posts, images });
});

router.get("/explore", (req, res) => {
    res.render("explore");
});

router.get("/new-post", (req, res) => {
    res.render("new-post", { post: null });
});

router.post("/new-post", (req, res) => {
    const { title, description, content } = req.body;
    const newPost = {
        id: postIdCounter++,
        title,
        description,
        content,
        image: images[Math.floor(Math.random() * images.length)]
    };
    posts.push(newPost);
    res.redirect(`/post/${newPost.id}`);
});

router.get("/edit-post/:id", (req, res) => {
    const post = posts.find(p => p.id == req.params.id);
    if (post) {
        res.render("new-post", { post });
    } else {
        res.status(404).send("Post not found");
    }
});

router.post("/edit-post/:id", (req, res) => {
    const { id, title, description, content } = req.body;
    const post = posts.find(p => p.id == id);
    if (post) {
        post.title = title;
        post.description = description;
        post.content = content;
        res.redirect(`/post/${post.id}`);
    } else {
        res.status(404).send("Post not found");
    }
});

router.post("/delete-post/:id", (req, res) => {
    posts = posts.filter(p => p.id != req.params.id);
    res.redirect('/');
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
});

router.get("/signup", (req, res) => {
    res.render("signup");
});

export default router;
