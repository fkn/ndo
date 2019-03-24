module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('unit', 'answerable', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    }),

  down: queryInterface => queryInterface.removeColumn('unit', 'answerable'),
};
