const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Review.init({
    delivered_on_budget: DataTypes.BOOLEAN,
    delivered_on_time: DataTypes.BOOLEAN,
    text_reviews: DataTypes.STRING,
    star_reviews: DataTypes.INTEGER,
    user_id_review_given_to: DataTypes.INTEGER,
    user_id_review_given_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Review'
  })
  Review.associate = function (models) {
  Review.belongsTo(models.User, { foreignKey: 'user_id_review_given_to' })
  }
  return Review
}