const Wiki = require("./models").Wiki;
const Authorizer = require("../policies/application");

module.exports = {
  getAllWikis(authorized, callback) {
  
    Wiki.scope({method: ["getWikis", authorized]}).findAll()
      .then((wikis) => {
        callback(null, wikis);
      })
      .catch((err) => {
        console.log(err)
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

    return Wiki.findByPk(id)
    .then((wiki) => {
      if(!wiki){
        return callback("Wiki not found");
      }
      wiki.update(updatedWiki, {
        fields: Object.keys(updatedWiki)
      })
      .then(() => {
        callback(null, wiki);
      })
      .catch((err) => {
        callback(err);
      });
    });
  },
  updateUserWikisToPublic(userId, callback){

      Wiki.update(
        {
          private: false,
        }, {
          where: {
            userId: userId
          }
        }
      )
      .then(() => {
        callback(null, wiki);
      })
      .catch((err) => {
        callback(err);
      });
  },
  addWiki(newWiki, callback) {

    return Wiki.create({
      title: newWiki.title,
      body: newWiki.body,
      userId: newWiki.userId,
      private: newWiki.private
     })
      .then((wiki) => {
        callback(null, wiki);
      })
      .catch((err) => {
        callback(err);
      })
  }

}//End