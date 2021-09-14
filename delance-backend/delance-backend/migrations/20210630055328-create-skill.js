module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Skills', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      skill_type: {
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
    await queryInterface.dropTable('Skills') 
  }
} 