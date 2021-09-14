const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Time_zone extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Time_zone.init({
    country_name: DataTypes.STRING,
    time_zone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Time_zone'
  })
  return Time_zone
}