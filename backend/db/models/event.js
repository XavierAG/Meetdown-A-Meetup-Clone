'use strict';
const {
  Model, Validator
} = require('sequelize');
const Venue = require('./venue')
const Group = require('./group')
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Event.belongsTo(models.Venue, { foreignKey: 'venueId' });
      Event.belongsTo(models.Group, { foreignKey: 'groupId' });
      Event.hasMany(models.Attendance , { foreignKey: 'eventId', onDelete: 'CASCADE'})
      Event.hasMany(models.EventImage , { foreignKey: 'eventId', onDelete: 'CASCADE'})
    }
  }
  Event.init({
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, Infinity]
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type:{
      type: DataTypes.ENUM('Online', 'In person'),
      allowNull: false,
      validate: {
        isIn: [['Online', 'In person']]
      }
    },
    capacity:{
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
      },
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true,
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfter: new Date().toISOString(),
      },
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfter: sequelize.col('startDate'),
      },
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
