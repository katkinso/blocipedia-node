module.exports = {
    // validatePosts(req, res, next) {/* validation definition */ },
 
    validateUsers(req, res, next) {
      if(req.method === "POST") {
        
        req.checkBody("name", "cannot be empty").isLength({min: 1})
        req.checkBody("email", "must be valid").isEmail();
        req.checkBody("password", "must be at least 6 characters in length").isLength({min: 6})
        req.checkBody("password_conf", "must match password provided").optional().matches(req.body.password);
      }
 
      const errors = req.validationErrors();
 
      if (errors) {
        req.flash("error", errors);
        return res.redirect(req.headers.referer);
      } else {
        return next();
      }
    }
 }
