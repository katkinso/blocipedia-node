var Sequelize = require('sequelize');
const Op = Sequelize.Op;

'use strict';
module.exports = (sequelize, DataTypes) => {
  var Wiki = sequelize.define('Wiki', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Wiki.associate = function(models) {
    // associations can be defined here
    Wiki.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
  };


  Wiki.addScope("getWikis", (authorized) => {

        let query = '';

        if (authorized){
          query = {
            order: [["createdAt", "DESC"]]
          }
        }else{
          query = {
            where: { private: false},
            order: [["createdAt", "DESC"]]
          }
        }

        return query;
   });


  return Wiki;
};