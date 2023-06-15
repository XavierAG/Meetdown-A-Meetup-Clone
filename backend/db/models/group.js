'use strict';
const { Model, Validator } = require('sequelize');
const User = require('./user');

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Group.belongsTo(models.User, { foreignKey: 'organizerId' });
    }
  }
  Group.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1,60],
      }
    },
    about: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [50, Infinity],
      }
    },
    type: {
      type: DataTypes.ENUM('Online', 'In person'),
      allowNull: false,
      validate: {
        isIn: [['Online', 'In person']]
      }
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        isBoolean: true,
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING
    },

  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
