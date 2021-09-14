const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Currency extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Currency.init({
    currency_type: DataTypes.STRING,
    user_address: DataTypes.STRING,
    currency_decimals: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Currency'
  })
  return Currency
}