const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');

passport.use(new LocalStrategy({
    usernameField: 'email'
},
async function (email, password, done) {
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            console.log('Invalid username or password');
            return done(null, false, { message: 'Invalid username or password' });
        }
        console.log(password);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password Match:', isMatch);  
        if (!isMatch) {
            console.log('Invalid username or password');
            return done(null, false, { message: 'Invalid username or password' });
        }

        return done(null, user);
    } catch (err) {
        console.log('Error in finding user');
        return done(err);
    }
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id);
        return done(null, user);
    } catch (err) {
        console.log('Error in finding user --> Passport');
        return done(err);
    }
});

passport.checkAuthentication = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Please sign in to continue');
    return res.redirect('/users/sign-in');
};

passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    next();
};

module.exports = passport;