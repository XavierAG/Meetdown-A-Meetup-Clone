"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Users";
    return queryInterface.bulkInsert(
      options,
      [
        {
          firstName: "Bill",
          lastName: "bil",
          email: "demo@user.io",
          username: "Demo-lition",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Demo",
          lastName: "User",
          email: "demo@demo.com",
          username: "DemoUser",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "jill",
          lastName: "jil",
          email: "user2@user.io",
          username: "FakeUser2",
          hashedPassword: bcrypt.hashSync("password3"),
        },
        {
          firstName: "job",
          lastName: "jo",
          email: "user1@example.com",
          username: "User1",
          hashedPassword: bcrypt.hashSync("password4"),
        },
        {
          firstName: "Billy",
          lastName: "cool",
          email: "user2@example.com",
          username: "User2",
          hashedPassword: bcrypt.hashSync("password5"),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: {
          [Op.in]: ["Demo-lition", "FakeUser1", "FakeUser2", "User1", "User2"],
        },
      },
      {}
    );
  },
};
