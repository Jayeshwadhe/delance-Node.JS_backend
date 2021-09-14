const { Model } = require('sequelize') 
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  } 
  Profile.init({
    image: DataTypes.STRING,
    profile_description: DataTypes.STRING,
    github_link: DataTypes.STRING,
    linkedin_link: DataTypes.STRING,
    portfolio_site_link: DataTypes.STRING,
    skills: DataTypes.STRING,
    hourly_rate: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    add_tagline: DataTypes.STRING,
    university_name: DataTypes.STRING,
	  course_name: DataTypes.STRING,
	  course_year_from:  DataTypes.INTEGER,
	  course_year_to: DataTypes.INTEGER,
	  designation: DataTypes.STRING,
	  company_name: DataTypes.STRING,
	  job_duration_month_from: DataTypes.STRING,
	  job_duration_year_from: DataTypes.INTEGER,
	  job_duration_month_to: DataTypes.STRING,
	  job_duration_year_to: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profile'
  }) 
  Profile.associate = function (models) {
  Profile.belongsTo(models.User, { foreignKey: 'user_id' }) 
}
  return Profile 
} 