'use strict';
const {
  Model
} = require('sequelize');
const Group = require('./group')
module.exports = (sequelize, DataTypes) => {
  class GroupImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      GroupImage.belongsTo(models.Group, { foreignKey: 'groupId'})
    }
  }
  GroupImage.init({
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        isBoolean: true
      }
    },
  }, {
    sequelize,
    modelName: 'GroupImage',
  });
  return GroupImage;
};
