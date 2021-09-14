module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      
      image: {
        type: Sequelize.STRING
      },
      profile_description: {
        type: Sequelize.STRING
      },
      github_link: {
        type: Sequelize.STRING
      },
      linkedin_link: {
        type: Sequelize.STRING
      },
      portfolio_site_link: {
        type: Sequelize.STRING
      },
      skills: {
        type: Sequelize.STRING
      },
      hourly_rate: {
        type: Sequelize.INTEGER
      },
      add_tagline: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      university_name:{
        type: Sequelize.STRING
      },
	    course_name:{
        type: Sequelize.STRING
      },
	    course_year_from:{
      type: Sequelize.INTEGER
      },
	    course_year_to:{
      type: Sequelize.INTEGER
      },
	    designation:{
      type: Sequelize.STRING
      },
	    company_name:{
      type: Sequelize.STRING
      },
	    job_duration_month_from:{
      type: Sequelize.STRING
      },
	    job_duration_year_from:{
      type: Sequelize.INTEGER
      },
	    job_duration_month_to:{
      type: Sequelize.STRING
      },
	    job_duration_year_to:{
      type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Profiles') 
  }
} 