"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Groups";
    return queryInterface.bulkInsert(
      options,
      [
        {
          organizerId: 1,
          name: "Morning Yoga in the Park",
          about:
            "Start your day with a rejuvenating yoga session in the park. All levels welcome.",
          type: "In person",
          private: false,
          city: "San Francisco",
          state: "CA",
        },
        {
          organizerId: 3,
          name: "Virtual Book Club",
          about:
            "Join our online book club and dive into captivating discussions about the latest novels.",
          type: "Online",
          private: true,
          city: "Dallas",
          state: "TX",
        },
        {
          organizerId: 2,
          name: "Hiking Adventures",
          about:
            "Explore the scenic trails and breathtaking landscapes on our group hikes. All skill levels welcome!",
          type: "In person",
          private: false,
          city: "Denver",
          state: "CO",
        },
        {
          organizerId: 1,
          name: "Art Workshop",
          about:
            "Unleash your creativity in our interactive art workshop. All art enthusiasts are welcome!",
          type: "In person",
          private: false,
          city: "New York",
          state: "NY",
        },
        {
          organizerId: 2,
          name: "Tech Talk",
          about:
            "Join our tech talk event and stay up to date with the latest trends in the tech industry.",
          type: "Online",
          private: false,
          city: "Houston",
          state: "TX",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Groups";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        name: {
          [Op.in]: [
            "Morning Yoga in the Park",
            "Virtual Book Club",
            "Hiking Adventures",
            "Tech Talk",
            "Art Workshop",
          ],
        },
      },
      {}
    );
  },
};
