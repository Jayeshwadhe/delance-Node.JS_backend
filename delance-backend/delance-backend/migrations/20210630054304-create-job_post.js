module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Job_Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      job_description: {
        type: Sequelize.STRING
      },
      user_id_job_posted_by: {
        type: Sequelize.INTEGER
      },
      budget: {
        type: Sequelize.INTEGER
      },
      category: {
        type: Sequelize.STRING
      },
      preferred_currency_type: {
        type: Sequelize.STRING
      },
      currency_type: {
        type: Sequelize.STRING
      },
      cover_letter: {
        type: Sequelize.STRING
      },
      preferred_skills: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      duration: {
        type: Sequelize.STRING
      },
      no_of_offers: {
        type: Sequelize.INTEGER
      },
      job_status: {
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
    await queryInterface.dropTable('Job_Posts') 
  }
} 