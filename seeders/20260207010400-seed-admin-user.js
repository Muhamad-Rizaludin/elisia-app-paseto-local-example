"use strict";

const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [rows] = await queryInterface.sequelize.query("SELECT id FROM roles WHERE name = 'admin' LIMIT 1;");
    if (!rows.length) {
      return;
    }

    const passwordHash = await bcrypt.hash("Admin12345!", 10);
    const now = new Date();

    await queryInterface.bulkInsert("users", [
      {
        role_id: rows[0].id,
        name: "System Admin",
        email: "admin@example.com",
        password_hash: passwordHash,
        created_at: now,
        updated_at: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "users",
      {
        email: {
          [Sequelize.Op.eq]: "admin@example.com"
        }
      },
      {}
    );
  }
};
