const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Proposal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Proposal.init({
    job_post_id: DataTypes.INTEGER,
    user_id_freelancer: DataTypes.INTEGER,
    proposal_price: DataTypes.INTEGER,
    preferred_currency_type: DataTypes.STRING,
    proposal: DataTypes.STRING,
    eth_address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Proposal'
  })
  Proposal.associate = function (models) {
    Proposal.belongsTo(models.Job_Post, { foreignKey: 'user_id_freelancer' })
    Proposal.belongsTo(models.Job_Post, { foreignKey: 'job_post_id' })
    Proposal.belongsTo(models.User, { foreignKey: 'user_id_freelancer' })
  }
  return Proposal
}