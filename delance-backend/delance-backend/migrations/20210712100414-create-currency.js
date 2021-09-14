module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Currencies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      currency_type: {
        type: Sequelize.STRING
      },
      user_address: {
        type: Sequelize.STRING
      },
      currency_decimals: {
        type: Sequelize.DECIMAL
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
    await queryInterface.dropTable('Currencies')  
  }
}  