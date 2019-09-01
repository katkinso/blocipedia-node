const userQueries = require("../db/queries.users.js");
const passport = require("passport");

module.exports = {
    signup(req, res, next) {
        res.render("signup");
        // res.send("hello");
        // res.render("signup", {title: "Blocipedia"});
    },
    create(req, res, next) {
        
        let newUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirmation: req.body.password_conf
        };

        userQueries.createUser(newUser, (err, user) => {
            if (err) {
                req.flash("error", err);
                res.redirect("/users/signup");
            } else {
                passport.authenticate("local")(req, res, () => {
                    req.flash("notice", "You've successfully signed in!");
                    res.redirect("/");
                })
            }
        });
    }
}


