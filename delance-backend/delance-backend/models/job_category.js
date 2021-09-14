const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Job_Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Job_Category.init({
    category_type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Job_Category'
  })
  return Job_Category
}