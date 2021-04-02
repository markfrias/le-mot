// Use real database this time
const express = require("express");
const passport = require("passport");
const app = express();
const session = require('express-session');



const LocalStrategy = require('passport-local').Strategy;


app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
let users = [{ username: "troy", password: "hellfire07" }, { username: "steven", password: "deskrat72" }];
app.use(passport.initialize());
app.use(passport.session())
app.use(session({
    secret: "cat",
    resave: false,
    saveUninitialized: false
}))

// Configure passport strategy
passport.use(new LocalStrategy(
    function (username, password, done) {
        const user = users.find(userr => username == userr.username);
        if (user == null) {
            console.log(user);
            return done(null, false, { message: "No user with that email" })
        } else {
            return done(null, user);
        }



    }
));
passport.serializeUser((user, done) => {
    done(null, user.username);
    console.log("Serialsss");
})
passport.deserializeUser((id, done) => {
    const user = users.find(usee => usee.username == id)
    done(err, user)

})




app.listen(3000, () => {
    console.log("Listening")
});

app.get('/', (req, res) => {
    res.send("hello");
    console.log(req.session);
});

app.get('/login', (req, res) => {
    res.render("login.ejs");
})

app.get('/deets', (req, res) => {
    console.log(req.body);
    try {
        console.log(req.session.passport['user']); ``

    } catch (err) {
        console.log("User is not logged in");
    }
    if (req.isAuthenticated()) {
        res.send("You're in bitch")
    } else {
        res.send("Bitch whut");
    }
})
app.post("/login",
    passport.authenticate('local'
    ), (req, res) => {
        res.send("Success")
    }

)





