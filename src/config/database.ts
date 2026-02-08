import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || "elisia_dev",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "postgres",
  logging: false,
  dialectOptions: process.env.DB_SSL === "true" ? { ssl: { require: true, rejectUnauthorized: false } } : {}
});

export const connectDatabase = async () => sequelize.authenticate();
