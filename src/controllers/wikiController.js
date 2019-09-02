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

        console.log("req.body=== ", req.body) //why is this NULL?
        wikiQueries.updateWiki(req.params.id, req.body, (err, wiki) => {
            
          if (err || wiki == null) {
            res.redirect(401, `/wikis/${req.params.id}/edit`);
          } else {
            res.redirect(`/wikis/${req.params.id}`);
          }
        });
    }
}//END