"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

    await queryInterface.addColumn("roles", "id_uuid", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.literal("gen_random_uuid()")
    });

    await queryInterface.addColumn("users", "id_uuid", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.literal("gen_random_uuid()")
    });

    await queryInterface.addColumn("users", "role_id_uuid", {
      type: Sequelize.UUID,
      allowNull: false
    });

    await queryInterface.addColumn("refresh_tokens", "id_uuid", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.literal("gen_random_uuid()")
    });

    await queryInterface.addColumn("refresh_tokens", "user_id_uuid", {
      type: Sequelize.UUID,
      allowNull: false
    });

    await queryInterface.sequelize.query("UPDATE roles SET id_uuid = gen_random_uuid() WHERE id_uuid IS NULL;");
    await queryInterface.sequelize.query("UPDATE users SET id_uuid = gen_random_uuid() WHERE id_uuid IS NULL;");
    await queryInterface.sequelize.query(
      "UPDATE users u SET role_id_uuid = r.id_uuid FROM roles r WHERE u.role_id = r.id;"
    );
    await queryInterface.sequelize.query(
      "UPDATE refresh_tokens rt SET user_id_uuid = u.id_uuid FROM users u WHERE rt.user_id = u.id;"
    );
    await queryInterface.sequelize.query(
      "UPDATE refresh_tokens SET id_uuid = gen_random_uuid() WHERE id_uuid IS NULL;"
    );

    await queryInterface.sequelize.query("ALTER TABLE refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_user_id_fkey;");
    await queryInterface.sequelize.query("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_id_fkey;");
    await queryInterface.sequelize.query("ALTER TABLE refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_pkey;");
    await queryInterface.sequelize.query("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pkey;");
    await queryInterface.sequelize.query("ALTER TABLE roles DROP CONSTRAINT IF EXISTS roles_pkey;");

    await queryInterface.removeColumn("refresh_tokens", "user_id");
    await queryInterface.removeColumn("refresh_tokens", "id");
    await queryInterface.removeColumn("users", "role_id");
    await queryInterface.removeColumn("users", "id");
    await queryInterface.removeColumn("roles", "id");

    await queryInterface.renameColumn("roles", "id_uuid", "id");
    await queryInterface.renameColumn("users", "id_uuid", "id");
    await queryInterface.renameColumn("users", "role_id_uuid", "role_id");
    await queryInterface.renameColumn("refresh_tokens", "id_uuid", "id");
    await queryInterface.renameColumn("refresh_tokens", "user_id_uuid", "user_id");

    await queryInterface.sequelize.query("ALTER TABLE roles ALTER COLUMN id SET DEFAULT gen_random_uuid();");
    await queryInterface.sequelize.query("ALTER TABLE users ALTER COLUMN id SET DEFAULT gen_random_uuid();");
    await queryInterface.sequelize.query("ALTER TABLE refresh_tokens ALTER COLUMN id SET DEFAULT gen_random_uuid();");

    await queryInterface.sequelize.query("ALTER TABLE roles ADD PRIMARY KEY (id);");
    await queryInterface.sequelize.query("ALTER TABLE users ADD PRIMARY KEY (id);");
    await queryInterface.sequelize.query("ALTER TABLE refresh_tokens ADD PRIMARY KEY (id);");

    await queryInterface.sequelize.query(
      "ALTER TABLE users ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE RESTRICT;"
    );

    await queryInterface.sequelize.query(
      "ALTER TABLE refresh_tokens ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;"
    );

    await queryInterface.addIndex("refresh_tokens", ["user_id"]);
  },

  async down() {
    throw new Error("Down migration not supported for UUID conversion");
  }
};
