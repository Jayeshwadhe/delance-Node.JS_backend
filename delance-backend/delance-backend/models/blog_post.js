const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Blog_Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Blog_Post.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Blog_Post'
  })
  Blog_Post.associate = function (models) {
  Blog_Post.hasMany(models.Comment, { foreignKey: 'post_id' })
  Blog_Post.hasMany(models.Like, { foreignKey: 'post_id' })
  }
  return Blog_Post
}