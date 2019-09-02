const Wiki = require("./models").Wiki;

module.exports = {
  getAllWikis(callback) {
    return Wiki.findAll({
      order: [
        ['title', 'ASC']
      ]
      })
      .then((wikis) => {
        callback(null, wikis);
      })
      .catch((err) => {
        callback(err);
      })
  },
  deleteWiki(req, callback) {

    return Wiki.findByPk(req.params.id)
    .then((wiki) => {
        wiki.destroy()
        .then((res) => {
            callback(null, wiki);
        });
    })
    .catch((err) => {
        callback(err);
    });
  },
  getWiki(id, callback) {
    return Wiki.findByPk(id)
      .then((wiki) => {
        callback(null, wiki);
      })
      .catch((err) => {
        callback(err);
      })
  },
  updateWiki(id, updatedWiki, callback){
    console.log("in queries - id= ", id)
    console.log("in queries - updatedWiki= ", updatedWiki)
    return Wiki.findByPk(id)
    .then((wiki) => {
      if(!wiki){
        return callback("Wiki not found");
      }

      wiki.update(updatedWiki, {
        
        fields: Object.keys(updatedWiki)
      })
      .then(() => {
        callback(null, post);
      })
      .catch((err) => {
        callback(err);
      });
    });
  }

}//End