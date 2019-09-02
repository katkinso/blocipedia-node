const wikiQueries = require("../db/queries.wikis.js");

module.exports = {
    index(req, res, next){
        wikiQueries.getAllWikis((err, wikis) => {

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
            console.log(err)
            res.redirect(404, `/wikis/${req.params.id}`)
          } else {
            req.flash("notice", "Wiki entry deleted");
            res.redirect("/wikis")
          }
        });
    },
    view(req, res, next) {
        wikiQueries.getWiki(req.params.id, (err, wiki) => {
          if (err || wiki == null) {
            res.redirect(404, "/");
          } else {
            res.render("wikis/view", { wiki });
          }
        });
    },
    edit(req, res, next) {
        wikiQueries.getWiki(req.params.id, (err, wiki) => {
          if (err || wiki == null) {
            res.redirect(404, "/");
          } else {    
            res.render("wikis/edit", { wiki });
          }
        });
    },
    update(req, res, next) {

        wikiQueries.updateWiki(req.params.id, req.body, (err, wiki) => {
            
          if (err || wiki == null) {
            res.redirect(401, `/wikis/${req.params.id}/edit`);
          } else {
            res.redirect(`/wikis/${req.params.id}`);
          }
        });
    },
    create(userId, newWiki, callback) {
        return Wiki.create({
          title: newWiki.title,
          body: newWiki.body,
          userId: userId
        })
          .then((wiki) => {
            callback(null, wiki);
          })
          .catch((err) => {
            callback(err);
          })
     },
     new(req, res, next) {
          res.render("wikis/new");
     },
     create(req, res, next) {
          let newWiki = {
            title: req.body.title,
            body: req.body.body,
            userId: req.user.id
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