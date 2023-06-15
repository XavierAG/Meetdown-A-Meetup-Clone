'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'GroupImages'
    await queryInterface.bulkInsert(options, [
        {
          groupId: 1,
          url: 'https://example.com/image1.jpg',
          preview: true
        },
        {
          groupId: 2,
          url: 'https://example.com/image2.jpg',
          preview: false
        },
        {
          groupId: 3,
          url: 'https://example.com/image3.jpg',
          preview: false
        },
        {
          groupId: 2,
          url: 'https://example.com/image4.jpg',
          preview: true
        },
        {
          groupId: 1,
          url: 'https://example.com/image5.jpg',
          preview: true
        }
      ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg', 'https://example.com/image3.jpg', 'https://example.com/image4.jpg', 'https://example.com/image5.jpg'] }
    }, {});
  }
};
