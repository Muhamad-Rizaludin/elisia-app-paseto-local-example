import dotenv from "dotenv";

const fallbackNodeEnv = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${fallbackNodeEnv}` });

const { createApp } = await import("@config/app");
const { bootstrapDatabase } = await import("@config/bootstrap");
const { logger } = await import("@config/logger");

await bootstrapDatabase();

const app = createApp();
const port = Number(process.env.PORT || 5000);

app.listen(port);

logger.info("Server started", {
  port,
  env: process.env.NODE_ENV || "development"
});
