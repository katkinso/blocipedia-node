'use strict';
const User = require("../models").User;
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {

      const salt = bcrypt.genSaltSync();
      const hashedPassword = bcrypt.hashSync('123456', salt);

      queryInterface.bulkInsert('Users', [
        {
          name: 'User Admin',
          role: 'admin',
          email: 'admin@blocipedia.com',
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'User Standard',
          role: 'standard',
          email: 'standard@blocipedia.com',
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'User Premium',
          role: 'premium',
          email: 'premium@blocipedia.com',
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date()
        }], {});

      const userAdmin = await User.findOne({
        where: {
            role: 'admin'
        },
      });

      const userStandard = await User.findOne({
        where: {
            role: 'standard'
        },
      });

      const userPremium = await User.findOne({
        where: {
            role: 'premium'
        },
      });

      return await queryInterface.bulkInsert('Wikis', 
      [{
          title: 'Title 1 - admin',
          body: 'Body admin',
          userId: userAdmin.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Title 2 - standard',
          body: 'Body standard',
          userId: userStandard.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Title 1 - premium',
          body: 'Body premium',
          userId: userPremium.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }]
      , {});
  },

  down: async (queryInterface, Sequelize) => {    
      await queryInterface.bulkDelete('Wikis', null, {});
      await queryInterface.bulkDelete('Users', null, {});
  }
};
