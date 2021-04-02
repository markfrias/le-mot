const cookieParser = require('cookie-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const express = require('express');
const config = require('./config');
const { Router } = require('express');
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
let users = [{ username: "troy", password: "hellfire07" }, { username: "steven", password: "deskrat72" }];

// Extractor function
var cookieExtractor = function (req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    return token;
};


const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;


app.use(cookieParser(config.jwt.secret));

// Configure passport strategy
passport.use(new LocalStrategy(
    function (username, password, done) {
        const user = users.find(userr => username == userr.username);
        if (user == null) {
            console.log(user);
            return done(null, false, { message: "No user with that email" })
        } else {
            console.log(user);
            return done(null, user);
        }



    }
));

passport.use(new JwtStrategy({ secretOrKey: config.jwt.secret, jwtFromRequest: cookieExtractor }, (jwt_payload, done) => {
    const user = users.find(userr => jwt_payload.sub == userr.username);
    if (user == null) {
        console.log(user);
        return done(null, false, { message: "No user with that email" })
    } else {
        return done(null, user);
    }
}))





app.use(passport.initialize());



console.log(config.jwt.secret)

app.listen('3000');
app.post('/login', passport.authenticate('local', {
    session: false
}), (req, res) => {
    jwt.sign({
        username: req.username
    }, config.jwt.secret, config.jwt.options, (err, token) => {
        if (err) return res.status(500).json(err);

        res.cookie('jwt', token, config.jwt.cookie);


        return res.json({
            jwt: token
        });



    })
})


/*app.use('/api', passport.authenticate('jwt-cookiecombo', {
    session: false
}), (res, req, next) => {
    return next();
}); */
app.get('/api/users', (req, res) => {
    console.log(req);
})
