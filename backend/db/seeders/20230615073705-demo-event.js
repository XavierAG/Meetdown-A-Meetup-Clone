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
      {
        venueId: 1,
        groupId: 1,
        name: 'Event 3',
        description: 'Event 3 description',
        type: 'Online',
        capacity: 80,
        price: 15,
        startDate: new Date('2023-06-20'),
        endDate: new Date('2023-06-21'),
      },
      {
        venueId: 3,
        groupId: 3,
        name: 'Event 4',
        description: 'Event 4 description',
        type: 'In person',
        capacity: 30,
        price: 25,
        startDate: new Date('2023-06-22'),
        endDate: new Date('2023-06-23'),
      },
      {
        venueId: 2,
        groupId: 2,
        name: 'Event 5',
        description: 'Event 5 description',
        type: 'Online',
        capacity: 150,
        price: 5,
        startDate: new Date('2023-06-25'),
        endDate: new Date('2023-06-26'),
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Event 1', 'Event 2', 'Event 3', 'Event 4', 'Event 5'] }
    }, {});
  }
};
