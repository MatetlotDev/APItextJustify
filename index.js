const express = require('express');
const app = express();
const db = require("quick.db");
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const justify = require('./justify');

const secretKey = 'uhfizadbohcvrizdbeiipr'; // secret key should be hidden in the .env file off course

// Interprétation du body de la requête
app.use(express.json());

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));
// parse an text body into a string
app.use(bodyParser.text({ type: 'text/plain' }));

app.post('/api/token', (req, res) => {

    if (!req.body.email) { // first verify if an email has been enterred -> better to add regex to match the email format
        return res.json({
            success: false,
            message: 'Authentication failed. email not found.'
        });
    }

    let user = db.fetch(`user_${req.body.email}`); // check if the user is already in the DB


    if (!user) { // if not create a new user with a new token, a words, and a date
        const payload = {
            email: req.body.email
        };
        const token = jwt.sign(payload, secretKey, {
            expiresIn: '24h' // option of jwt
        });
        db.set(`user_${req.body.email}`, { "email": req.body.email, "token": token, "words": 0, "date": new Date() });
        res.json({
            status: "success",
            message: 'New user, your security token:',
            token: token
        });
    } else {
        // if already in the DB, refresh it with new token and everything to initial
        const payload = {
            email: user.email
        };
        const token = jwt.sign(payload, secretKey, {
            expiresIn: '24h'
        });
        db.set(`user_${req.body.email}`, { "email": req.body.email, "token": token, "words": 0, "date": new Date() });
        
        res.json({
            status: "success",
            message: 'Your security token:',
            token: token
        });
    }
})


app.post('/api/justify', (req, res) => {
    let token = req.headers['token']; //verify is there's a token
    
    if (!token) { // if no token is given return
        return res.json({ status: "error", message: 'Failed to authenticate token.1' });
    }
    jwt.verify(token, secretKey, function (err, decoded) { // then check if token is right one
        if (err) {
            return res.json({ status: "error", message: 'Failed to authenticate token.2' });
        } else {
            req.decoded = decoded; // if token ok
        }
    });


    db.all().forEach((element) => {
        // look in the db to take the right user
        let userdb = element.ID.startsWith(`user_`);
        if (!userdb) return; // return if it's not a user
        
        
        if (token !== db.fetch(`${element.ID}.token`)) return res.json({ status: "error", message: 'Failed to authenticate token.3' });
        let user = db.fetch(element.ID);

        // TEST Date > 24h
        let day = new Date(user.date).getTime(); // take the time of the user's date
        let currentDate = new Date().getTime(); //  and compare it with the current time
        
        if (currentDate - day >= 86400000) { // check if it has gone over 24h
            
            db.set(`${element.ID}.date`, new Date()); // inititialize it back, if yes
            db.set(`${element.ID}.words`, 0);
        }

        // check if there's a text in the body
        if (Object.keys(req.body).length === 0) return res.json({ status: "error", message: 'Please specify your text in the body' });
        const array = req.body.split(' '); // split the text in an array of string with each word

        // add as many word as there's is in the text
        user.words += array.length;
        db.add(`${element.ID}.words`, array.length);

        // check the limit number of word of the user
        if (user.words > 80000) 
            res.status(402).json({ status: "error", message: '402 Payment Required.' });
        else {
            return res.send(justify(req.body)); // otherwise sent the text justified
        }
    });
})


// route to see all the users in the database
app.get('/api/users', (req, res) => {
    let users = [];
    db.all().forEach((element, i) => {
        users.push(element.data.email);
    });
    res.json(users);
})



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
});