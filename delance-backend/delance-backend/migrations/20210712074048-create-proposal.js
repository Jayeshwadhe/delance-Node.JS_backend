module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Proposals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      job_post_id: {
        type: Sequelize.INTEGER
      },
      user_id_freelancer: {
        type: Sequelize.INTEGER
      },
      proposal_price: {
        type: Sequelize.INTEGER
      },
      preferred_currency_type: {
        type: Sequelize.STRING
      },
      proposal: {
        type: Sequelize.STRING
      },
      eth_address: {
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
    await queryInterface.dropTable('Proposals')   
  }
}   