var express = require('express');
var usersRouter = express.Router();
const fs = require("fs");

//utils custom module reference
const authorization = require('./../utils/auth');

/* GET users login page. */
usersRouter.get('/login', function(req, res, next) {
    res.render('login', { title: 'login' });
});

/* GET users register page. */
usersRouter.get('/register', function(req, res, next) {
    res.render('register', { title: 'register' });
});

/* Post and persist user registration info. */
usersRouter.post('/register', function(request, response, next) {
    // get user data from form
    var email = request.body.email;
    var password = request.body.password;
    var username = request.body.username;
    user = insertUser(username, email, password);
    if (user) {
        console.log(`success: Added User is ${user}`);
        response.statusCode = 200;
        response.end();
    } else {
        console.log("failure/unable to insert");
        response.statusCode = 403; // Forbidden
        response.end();
    }

});

/* Authentication of users login. */
usersRouter.post('/login', function(request, response) {
    // get user data from form
    users = getUsers();
    console.log("login authentication");
    console.log(JSON.stringify(users));
    var email = request.body.email;
    var password = request.body.password;
    if (authorization.authorize(email, password, users)) {
        response.statusCode = 200;
        console.log("success");
        response.end();
    } else {
        response.statusCode = 403; // Forbidden
        response.end();
    }
});

// Save User to users.json upon successful validation
var saveUsers = function(users) {
    console.log("save users");
    fs.writeFileSync('data/users.json', JSON.stringify(users));
}

// Add user to users.json
var insertUser = (username, email, password) => {
    console.log("insertUser");
    var users = getUsers();

    // in ES6, if param and prop names are the same,
    // you can use the following syntax instead of
    // name: name, elev: elev
    var user = {
        username,
        password,
        email
    };

    // ensure no dups
    var duplicateUsers = users.filter((user) => {
        return user.name === username;
    });

    // verify duplicate email validation
    var duplicateEmails = users.filter(function(user) {
        return user.email === email;
    })

    // verify if user/email exists
    if (duplicateUsers.length == 0 && duplicateEmails.length == 0) {
        users.push(user);
        saveUsers(users);
        return user;
    }
};

// get all Users
var getUsers = function() {
    try {
        var usersString = fs.readFileSync('data/users.json');
        return JSON.parse(usersString);
    } catch (err) {
        console.log(err);
        return [];
    }
}

module.exports = usersRouter;