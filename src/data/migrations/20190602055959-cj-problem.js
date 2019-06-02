module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('cjproblem', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
    }),

  down: queryInterface => queryInterface.dropTable('cjproblem'),
};
