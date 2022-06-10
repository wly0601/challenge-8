const bcrypt = require('bcryptjs');
const { Role } = require('../../app/models');
const { Op } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    const password = 'iloveyou';
    const encryptedPassword = bcrypt.hashSync(password);
    const timestamp = new Date();

    const role = await Role.findOne({
      where: {
        name: 'ADMIN',
      },
    });

    const user = [
      {
        name: 'admin',
        email: 'admin@binar.co.id',
        encryptedPassword,
        roleId: role.id,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ];

    await queryInterface.bulkInsert('Users', user, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      name: {
        [Op.in]: names 
      } 
    }, {});
  },
};