const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Dispute extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Dispute.init({
    job_id: DataTypes.INTEGER,
    raised_by_id: DataTypes.INTEGER,
    raised_to_id: DataTypes.INTEGER,
    comment: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Dispute'
  })
    Dispute.associate = function (models) {
    Dispute.belongsTo(models.Job_Post, { foreignKey: 'raised_by_id' })
    Dispute.belongsTo(models.User, {foreignKey : 'raised_by_id'})
  } 
  return Dispute
} 