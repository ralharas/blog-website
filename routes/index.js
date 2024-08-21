import express from 'express';
import db from '../db/db.js';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import passport from "passport";
import env from "dotenv";


const router = express.Router();
const saltRounds = 10;
let posts = [];
let postIdCounter = 1;
const images = ['beach.jpg', 'img1.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg', 'img6.jpg'];

router.get('/', (req, res) => {
    res.render('index', { posts, 
        images, 
        user: req.user });
});

router.get("/explore", (req, res) => {
    res.render("explore", {user: req.user});
});

router.get("/new-post", (req, res) => {
    if(req.isAuthenticated()) {
        res.render("new-post", { post: null,
        user: req.user });
    }
    else{
        res.send(`<h1> You must login to Create New Posts</h1>
        <script> 
            setTimeout(function() {
                window.location.href = '/signup';
            }, 3000);
            </script>`)
    }
});

router.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"],
})
);

router.post("/new-post", (req, res) => {
    console.log("Is user authenticated?", req.isAuthenticated());
    if (req.isAuthenticated()) {  
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
    } else {
        res.send(`
            <h1>You Must Login to Create New Posts</h1>
            <script> 
            setTimeout(function() {
                window.location.href = '/signup';
            }, 3000);
            </script>
        `);
    }
});


router.get("/edit-post/:id", (req, res) => {
    const post = posts.find(p => p.id == req.params.id);
    if (post) {
        res.render("new-post", { post, 
            user: req.user });
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
        res.render("post", { post, user: req.user });
    } else {
        res.status(404).send("Post not found");
    }
});

router.get("/signin", (req, res) => {
    res.render("signin", {user: req.user});
});

router.get("/signup", (req, res) => {
    res.render("signup", {user: req.user});
});

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); } 
        res.redirect('/');
    });
});



router.post("/signin-user", (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.send(`
                <h1>Error logging in, please try again later.</h1>
            `);
        }
        if (!user) {
            return res.send(`
                <h1>${info.message}</h1>
                <script>
                    setTimeout(function() {
                        window.location.href = '/signin';
                    }, 3000);
                </script>
            `);
        }
        req.login(user, (err) => {
            if (err) {
                return res.send(`
                    <h1>Error logging in, please try again later.</h1>
                `);
            }
            return res.send(`
                <h1>User logged in, redirecting to home </h1>
                <script>
                    setTimeout(function(){
                        window.location.href = '/'
                    }, 3000);
                </script>
            `);
        });
    })(req, res, next);
});



router.post("/signup-user", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    try {
        const checkResult = await db.query("SELECT * FROM users WHERE username = $1", [username]);
        const checkEmailResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        
        if (checkResult.rows.length > 0 || checkEmailResult.rows.length > 0) {
            res.send(`
                <h1> Username or email already exists, redirecting to login!</h1>
                <script>
                    setTimeout(function() {
                        window.location.href = '/signin';
                    }, 3000);
                </script>
            `);
        } else {
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                    res.send(`
                        <h1>Error registering user, please contact support for assistance</h1>
                        <script>
                            setTimeout(function() {
                                window.location.href = '/signup';
                            }, 1000);
                        </script>
                    `);
                } else {
                    const result = await db.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3)", 
                    [username, email, hash]);
                    res.send(`
                        <h1>User registered, redirecting to login page in 5 seconds</h1>
                        <script>
                            setTimeout(function() {
                                window.location.href = '/signin';
                            }, 3000);
                        </script>
                    `);
                }
            });
        }
    } catch (err) {
        console.log(err);
        res.send(`<h1>Error registering user, please try again later.</h1>`);
    }
});

export default router;