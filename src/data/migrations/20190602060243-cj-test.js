module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('cjtest', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
      },
      idCj: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
    }),

  down: queryInterface => queryInterface.dropTable('cjtest'),
};
