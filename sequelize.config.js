const env = process.env.NODE_ENV || "development";

const common = {
  dialect: "postgres",
  logging: false,
  migrationStorageTableName: "sequelize_meta"
};

const config = {
  development: {
    ...common,
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || "elisia_dev",
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "aulia1234"
  },
  staging: {
    ...common,
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || "elisia_staging",
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "postgres"
  },
  production: {
    ...common,
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || "elisia_prod",
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "postgres",
    dialectOptions: process.env.DB_SSL === "true" ? { ssl: { require: true, rejectUnauthorized: false } } : {}
  },
  test: {
    ...common,
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || "elisia_test",
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "postgres"
  }
};

module.exports = config[env];
