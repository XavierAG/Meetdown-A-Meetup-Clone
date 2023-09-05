"use strict";
const { Model, Validator } = require("sequelize");
const User = require("./user");

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Group.belongsTo(models.User, { foreignKey: "organizerId" });
      Group.hasMany(models.Venue, {
        foreignKey: "groupId",
        onDelete: "CASCADE",
      });
      Group.hasMany(models.Membership, {
        foreignKey: "groupId",
        onDelete: "CASCADE",
      });
      Group.hasMany(models.GroupImage, {
        foreignKey: "groupId",
        onDelete: "CASCADE",
      });
      Group.hasMany(models.Event, {
        foreignKey: "groupId",
        onDelete: "CASCADE",
      });
    }
  }
  Group.init(
    {
      organizerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
          len: [1, 60],
        },
      },
      about: {
        type: DataTypes.STRING(500),
        allowNull: false,
        validate: {
          len: [30, 500],
        },
      },
      type: {
        type: DataTypes.ENUM("Online", "In person"),
        allowNull: false,
        validate: {
          isIn: [["Online", "In person"]],
        },
      },
      private: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
          isBoolean: true,
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Group",
    }
  );
  return Group;
};
