// Purely use Passport JWT strategy for API authentication

// Declare middlewares
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();


// Express
const app = express();


// Thingies
app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Configure database connection
mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected!")
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model("User", userSchema);

// Add new users to database
/* const user1 = new User({ username: "marco", password: "123456" });
const user2 = new User({ username: "franz", password: "678890" });

user1.save((err) => {
    if (err) return console.log(err);
    // Saved
    console.log("Saved");
})

user2.save((err) => {
    if (err) return console.log(err);
    // Saved
    console.log("Saved");
}) */

// Listen on port 3000
app.listen('3000', () => {
    console.log("Listening on port 3000")
})

// Login route
app.post('/login', (req, res) => {

    // Authenticate user

    let token = jwt.sign({ sub: req.body.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Use bcrypt to encrypt passwords
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    authenticate(req.body, res, token);

})

// Test user route
app.get('/api/users', async (req, res) => {
    let isAuthorized = await authorize(req);
    if (!isAuthorized) {
        res.statusCode = 401;
        res.statusMessage = "Access Denied"
        return res.json({ message: "You are not logged in." })
    }

    User.find({}, (err, docs) => {
        res.send(docs);
    })


}

);

// Test authorization for routes without passport-jwt
/*let jwtoken = req.headers.authorization.slice(7);
    jwt.verify(jwtoken, process.env.JWT_SECRET, (err, decoded) => {
        if (err !== null) return res.json({ status: "Access denied" });

        User.find({}, (err, docs) => {
            if (err) return res.json({ status: "Error" });
            return res.json(docs);
        })

    });*/


function authenticate(requestBody, res, token) {
    User.findOne({ username: requestBody.username }, (err, user) => {

        // Execute if user does not exist
        if (user === null) {
            res.json({ status: "Incorrect credentials" });

            // Execute if the password is incorrect
        } else if (user.password !== requestBody.password) {
            res.json({ status: "Incorrect credentials" });

            // Execute if the credentials match an existing user
        } else {
            res.json({ jwt: "Bearer " + token, status: "Success" });
        }
        // EXPIRE TOKEN
        // !!!!!!!!!!!!!!

    }




    )
}

// Returns a promise for the user value
function authorize(req) {
    return new Promise((resolve, reject) => {

        try {
            if (req.headers.authorization.slice(0, 6) !== "Bearer") {
                console.log("Error")
            }
        } catch (err) {
            resolve(false)
        }

        let jwtoken = req.headers.authorization.slice(7);

        jwt.verify(jwtoken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return resolve(false);

            User.findOne({ username: decoded.sub }, (err, docs) => {
                if (err) return resolve(false)
                req.user = docs;
                resolve(true);

            })
        });

    })
}


