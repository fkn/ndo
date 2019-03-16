module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('User', 'emailConfirm', Sequelize.STRING),

  down: queryInterface => queryInterface.removeColumn('User', 'emailConfirm'),
};
