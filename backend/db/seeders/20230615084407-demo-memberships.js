'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Memberships';
    await queryInterface.bulkInsert(options, [
      {
        userId: 1,
        groupId: 1,
        status: 'organizer',
      },
      {
        userId: 2,
        groupId: 1,
        status: 'co-host',
      },
      {
        userId: 3,
        groupId: 2,
        status: 'member',
      },
      {
        userId: 4,
        groupId: 2,
        status: 'member',
      },
      {
        userId: 5,
        groupId: 2,
        status: 'pending',
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Memberships';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
