'use strict';


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Events';
    await queryInterface.bulkInsert(options, [
      {
        venueId: 1,
        groupId: 1,
        name: 'Event 1',
        description: 'Event 1 description',
        type: 'Online',
        capacity: 100,
        price: 10,
        startDate: new Date('2023-06-15'),
        endDate: new Date('2023-06-16'),
      },
      {
        venueId: 2,
        groupId: 2,
        name: 'Event 2',
        description: 'Event 2 description',
        type: 'In person',
        capacity: 50,
        price: 20,
        startDate: new Date('2023-06-17'),
        endDate: new Date('2023-06-18'),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2] }
    }, {});
  }
};
