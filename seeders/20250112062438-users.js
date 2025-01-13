const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('users', [
      {
        nama_depan: 'Arwin',
        nama_belakang: 'Halim',
        email: 'arwin@gmail.com',
        password: bcrypt.hashSync('arwin321', 10),
        gender: 'L',
        tanggal_lahir: '2025-01-12',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
