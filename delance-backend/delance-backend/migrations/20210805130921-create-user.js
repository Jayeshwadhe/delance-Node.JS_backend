module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.INTEGER
      },
      country:{
        type:Sequelize.STRING
      },
      state:{
        type:Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      send_useful_emails: {
        type: Sequelize.BOOLEAN
      },
      terms_of_use: {
        type: Sequelize.BOOLEAN
      },
      otp: {
        type: Sequelize.INTEGER
      },
      is_block: {
        type: Sequelize.BOOLEAN,
        defaultValue:false
      },
      is_complete: {
        type: Sequelize.BOOLEAN,
        defaultValue:false
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue:false
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
    await queryInterface.dropTable('Users')
  }
}