const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Job_Title extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Job_Title.init({
    job_title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Job_Title'
  })
  return Job_Title
}