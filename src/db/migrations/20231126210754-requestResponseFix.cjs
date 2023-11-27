'use strict';
const { DataTypes } = require ("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.removeColumn('RequestResponses',"ProcessorID",DataTypes.INTEGER)
    await queryInterface.addColumn('RequestResponses',"ProcessorId",DataTypes.INTEGER)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('RequestResponses',"ProcessorId",DataTypes.INTEGER)
    await queryInterface.addColumn('RequestResponses',"ProcessorID",DataTypes.INTEGER)
  }
};
