'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Venues';
    await queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        address: '123 Main St',
        city: 'City 1',
        state: 'State 1',
        lat: 123.456,
        lng: 789.012,
      },
      {
        groupId: 2,
        address: '456 Elm St',
        city: 'City 2',
        state: 'State 2',
        lat: 345.678,
        lng: 901.234,
      },
      {
        groupId: 1,
        address: '789 Oak St',
        city: 'City 3',
        state: 'State 3',
        lat: 567.890,
        lng: 123.456,
      },
      {
        groupId: 3,
        address: '987 Pine St',
        city: 'City 4',
        state: 'State 4',
        lat: 901.234,
        lng: 345.678,
      },
      {
        groupId: 2,
        address: '321 Maple St',
        city: 'City 5',
        state: 'State 5',
        lat: 789.012,
        lng: 567.890,
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['123 Main St', '456 Elm St', '789 Oak St', '987 Pine St', '321 Maple St'] }
    }, {});
  }
};
