module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Disputes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      job_id: {
        type: Sequelize.INTEGER
      },
      raised_by_id: {
        type: Sequelize.INTEGER
      },
      raised_to_id: {
        type: Sequelize.INTEGER
      },
      comment: {
        type: Sequelize.STRING
      },
      status: {
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
    await queryInterface.dropTable('Disputes')
  }
}