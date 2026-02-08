"use strict";

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert("roles", [
      {
        name: "admin",
        created_at: now,
        updated_at: now
      },
      {
        name: "user",
        created_at: now,
        updated_at: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "roles",
      {
        name: {
          [Sequelize.Op.in]: ["admin", "user"]
        }
      },
      {}
    );
  }
};
