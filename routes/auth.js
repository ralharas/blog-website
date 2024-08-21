import passport from 'passport';
import passportLocal, { Strategy } from 'passport-local';
import db from '../db/db.js'; 
import bcrypt from 'bcryptjs';  

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
