const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    role: DataTypes.INTEGER,
    country:DataTypes.STRING,
    state:DataTypes.STRING,
    city: DataTypes.STRING,
    send_useful_emails: DataTypes.BOOLEAN,
    terms_of_use: DataTypes.BOOLEAN,
    otp: DataTypes.INTEGER,
    is_block: {
    type: DataTypes.BOOLEAN,
    defaultValue:false
    },
    is_complete: {
      type: DataTypes.BOOLEAN,
      defaultValue:false
      },
    is_verified:{
      type: DataTypes.BOOLEAN,
      defaultValue:false
      },
  }, {
    sequelize,
    modelName: 'User'
  })
  User.associate = function (models) {
  User.hasOne(models.Profile, { foreignKey: 'user_id' })
  User.hasMany(models.Review, { foreignKey: 'user_id_review_given_to' })
  User.hasMany(models.Proposal, { foreignKey: 'user_id_freelancer' })
  User.hasOne(models.Dispute, { foreignKey: 'raised_by_id' })
  User.hasMany(models.Job_Post, { foreignKey: 'user_id_job_posted_by' })
}
  return User
}
