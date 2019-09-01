const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');


module.exports = {
    signup(req, res, next) {
        res.render("signup");
        // res.send("hello");
        // res.render("signup", {title: "Blocipedia"});
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
    }
    //,
    // testEmail(req, res, next) {

    //     console.log("testEmail: got here")
    //     const msg = {
    //         to: 'katyratkinson@yahoo.com',
    //         from: 'test@example.com',
    //         subject: 'Subject: email test in user controller',
    //         text: 'Text: body of the email',
    //         html: '<strong>This is HTML!!</strong>',
    //       };
    //       sgMail.send(msg);
    //       req.flash("notice", "Email sent");
    //       res.redirect("/users/signup");
    // }
}


