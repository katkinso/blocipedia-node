const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');


module.exports = {
    signup(req, res, next) {
        console.log("stripeApiKeyx", req.stripeApiKeyx)
        res.render("signup");
    },
    create(req, res, next) {

        const emailMsg = {
            to: req.body.email,
            from: 'blocipedia@noreply.com',
            subject: 'Welcome to Blocipedia',
            text: `Hi, ${req.body.name} Welcome! You've successfully signed up to Blocipedia.`,
            html: `<p>Hi, ${req.body.name} Welcome!</p> <p>You've successfully signed up to Blocipedia.</p>`,
          }; 
        
        let newUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirmation: req.body.password_conf,
            emailMsg: emailMsg
        };

        

        userQueries.createUser(newUser, (err, user) => {
            if (err) {
                req.flash("error", err);
                res.redirect("/users/signup");
            } else {
                passport.authenticate("local")(req, res, () => {
                    sgMail.send(newUser.emailMsg);
                    req.flash("notice", "You've successfully signed up! Check your email");
                    res.redirect("/");
                })
            }
        });
    },
    signin(req, res, next) {
        res.render("signin");
    },
    authenticate(req, res, next) {
        //Check syntax with Alvaro
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err); }
            
            if (!user) { 
                req.flash("notice", "Sign in failed. Please try again.")
                res.redirect("/users/signin");
            }

            req.login(user, function(err) {
              if (err) { return next(err); }
              req.flash("notice", "You've successfully signed in!");
              res.redirect("/");
            });
          })(req, res, next); // <-- explain syntax

        
    },
    signout(req, res, next){
        req.logout();
        req.flash("notice", "You've successfully signed out!");
        res.redirect("/");
    },
    profile(req, res, next) {
        res.render("profile");
    },
}





// res.send("hello");
// res.render("signup", {title: "Blocipedia"});


