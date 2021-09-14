const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Comment.init({
    post_id: DataTypes.INTEGER,
    comment: DataTypes.STRING,
    user_id_comment_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment'
  })
  Comment.associate = function (models) {
   Comment.belongsTo(models.Blog_Post, { foreignKey: 'post_id' })
  }
  return Comment
}