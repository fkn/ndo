module.exports = {
  up: queryInterface =>
    queryInterface.renameColumn('course', 'depsBody', 'schema'),

  down: queryInterface =>
    queryInterface.renameColumn('course', 'schema', 'depsBody'),
};
