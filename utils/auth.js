// validate user entered credentials with user entered details

authorize = function(email, password, users) {
    var validUser = users.filter((user) => {
        return user.email === email && user.password === password;
    });

    if (validUser.length === 1) {
        return true;
    }
    return false;
}

module.exports = {
    authorize
};