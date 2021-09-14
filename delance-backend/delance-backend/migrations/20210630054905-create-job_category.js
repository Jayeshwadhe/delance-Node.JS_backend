module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Job_Categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      category_type: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }) 
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Job_Categories') 
  }
} 