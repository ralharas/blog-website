import passport from 'passport';
import passportLocal, { Strategy } from 'passport-local';
import db from '../db/db.js'; 
import bcrypt from 'bcryptjs';  
import GoogleStrategy from "passport-google-oauth2"
const LocalStrategy = passportLocal.Strategy;

passport.use(new LocalStrategy(
    function(username, password, done) {
        db.query("SELECT * FROM users WHERE username = $1", [username], (err, result) => {
            if (err) { return done(err); }

            if (!result.rows.length) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            const user = result.rows[0];
            const storedHashPassword = user.password;

            bcrypt.compare(password, storedHashPassword, (err, isMatch) => {
                if (err) { return done(err); }

                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect password.' });
                }
            });
        });
    }
));

passport.use("google", 
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:300/auth/google/secrets",
        userProfileURL: "https//www.googleleapis.com/oauth2/v3/userinfo",

    }, async(accessTokem, refreshToken, profile, cb)=> {
        console.log(profile);
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.query("SELECT * FROM users WHERE id = $1", [id], (err, result) => {
        if (err) { return done(err); }
        done(null, result.rows[0]);
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        db.query("SELECT * FROM users WHERE username = $1", [username], (err, result) => {
            if (err) { return done(err); }

            if (!result.rows.length) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            const user = result.rows[0];
            const storedHashPassword = user.password;

            bcrypt.compare(password, storedHashPassword, (err, isMatch) => {
                if (err) { return done(err); }

                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect password.' });
                }
            });
        });
    }
));


export default passport;
