const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Job_Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Job_Post.init({
    job_description: DataTypes.STRING,
    user_id_job_posted_by: DataTypes.INTEGER,
    budget: DataTypes.INTEGER,
    category: DataTypes.STRING,
    preferred_currency_type: DataTypes.STRING,
    currency_type: DataTypes.STRING,
    cover_letter: DataTypes.STRING,
    preferred_skills: DataTypes.STRING,
    location: DataTypes.STRING,
    duration: DataTypes.STRING,
    no_of_offers: DataTypes.INTEGER,
    job_status:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Job_Post'
  })
  Job_Post.associate = function (models) {
    Job_Post.hasMany(models.Proposal, { foreignKey: 'user_id_freelancer' })
    Job_Post.hasOne(models.Dispute, { foreignKey: 'raised_by_id' })
    Job_Post.belongsTo(models.User, { foreignKey: 'user_id_job_posted_by' })
  }
  return Job_Post
}