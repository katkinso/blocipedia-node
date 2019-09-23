const wikiQueries = require("../db/queries.wikis.js");
const Authorizer = require("../policies/application");
const markdown = require( "markdown" ).markdown;

module.exports = {
    index(req, res, next){

      var authorized = false;
      if (req.user){ 
        authorized = new Authorizer(req.user).setPrivate();
      }

      wikiQueries.getAllWikis( authorized, (err, wikis) => {
            if (err) {
                res.redirect(500, "static/index");
            } else {
                res.render("wikis/index", { wikis });
            }
      })
    },
    delete(req, res, next) {

        wikiQueries.deleteWiki(req, (err, wiki) => {
          if (err) {
            res.redirect(404, `/wikis/${req.params.id}`)
          } else {
            req.flash("notice", "Wiki entry deleted");
            res.redirect("/wikis")
          }
        });
    },
    view(req, res, next) {

        wikiQueries.getWiki(req.params.id, (err, wiki) => {

          wiki.body = markdown.toHTML(wiki.dataValues.body)

          if (err || wiki == null) {
            res.redirect(404, "/");
          } else {
            res.render("wikis/view", { wiki });
          }
        });
    },
    edit(req, res, next) {
      
        const authorizer = new Authorizer(req.user);
        const authorized = authorizer.edit();


        wikiQueries.getWiki(req.params.id, (err, wiki) => {
          if (err || wiki == null) {
            res.redirect(404, "/");
          } else {    

            wiki.bodyFormatted = markdown.toHTML(wiki.dataValues.body);
            
            if (authorized){
                res.render("wikis/edit", { wiki, "setPrivate": authorizer.setPrivate() });
            } else {
                req.flash("You're not authorized to do that.")
                res.redirect(`/wikis/${req.params.id}`)
            }
          }
        });
    },
    update(req, res, next) {

      req.body.private ? req.body.private = true : req.body.private = false;

        wikiQueries.updateWiki(req.params.id, req.body, (err, wiki) => {
            
          if (err || wiki == null) {
            res.redirect(401, `/wikis/${req.params.id}/edit`);
          } else {
            res.redirect(`/wikis/${req.params.id}`);
          }
        });
    },
     new(req, res, next) {
          const authorizer = new Authorizer(req.user);
          res.render("wikis/new", {setPrivate: authorizer.setPrivate()});
     },
     create(req, res, next) {

          let newWiki = {
            title: req.body.title,
            body: req.body.body,
            userId: req.user.id,
            private: req.body.private ? true : false
          };
          wikiQueries.addWiki(newWiki, (err, wiki) => {
            if (err) {
              res.status(500).redirect("wikis/new");
            } else {
              res.status(303).redirect(`/wikis/${wiki.id}`);
            }
          });
      },
}//END