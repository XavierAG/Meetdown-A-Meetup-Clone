"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "EventImages";
    await queryInterface.bulkInsert(options, [
      {
        eventId: 1,
        url: "https://images.unsplash.com/photo-1524863479829-916d8e77f114?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=eneko-urunuela-I2YSmEUAgDY-unsplash.jpg",
        preview: true,
      },
      {
        eventId: 2,
        url: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=kourosh-qaffari-RrhhzitYizg-unsplash.jpg",
        preview: false,
      },
      {
        eventId: 3,
        url: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=toomas-tartes-Yizrl9N_eDA-unsplash.jpg",
        preview: false,
      },
      {
        eventId: 4,
        url: "https://images.unsplash.com/photo-1564399580075-5dfe19c205f3?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=artur-matosyan-4YWUMaftmag-unsplash.jpg",
        preview: true,
      },
      {
        eventId: 5,
        url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=desola-lanre-ologun-IgUR1iX0mqM-unsplash.jpg",
        preview: true,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "EventImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        url: {
          [Op.in]: [
            "https://example.com/image11.jpg",
            "https://example.com/image12.jpg",
            "https://example.com/image13.jpg",
            "https://example.com/image14.jpg",
            "https://example.com/image10.jpg",
          ],
        },
      },
      {}
    );
  },
};
