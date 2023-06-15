'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VenueGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      VenueGroup.belongsTo(models.Venue, { foreignKey: 'venueId' });
      VenueGroup.belongsTo(models.Group, { foreignKey: 'groupId' });
    }
  }
  VenueGroup.init({
    venueId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'VenueGroup',
  });
  return VenueGroup;
};
