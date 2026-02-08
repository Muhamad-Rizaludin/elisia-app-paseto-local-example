import { createLogger, format, transports } from "winston";
import { existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from "node:fs";
import path from "node:path";

const logsDir = path.resolve(process.cwd(), "logs");
const currentDate = new Date().toISOString().slice(0, 10);
const infoLogPath = path.join(logsDir, `info-${currentDate}.log`);
const errorLogPath = path.join(logsDir, `error-${currentDate}.log`);

const ensureLogsDirectory = () => {
  if (!existsSync(logsDir)) {
    mkdirSync(logsDir, { recursive: true });
  }
};

const removeExpiredLogs = (prefix: string, retentionDays: number) => {
  const now = Date.now();
  const maxAgeMs = retentionDays * 24 * 60 * 60 * 1000;
  const files = readdirSync(logsDir);

  for (const fileName of files) {
    if (!fileName.startsWith(prefix) || !fileName.endsWith(".log")) {
      continue;
    }

    const filePath = path.join(logsDir, fileName);
    const fileStats = statSync(filePath);
    const ageMs = now - fileStats.mtimeMs;

    if (ageMs > maxAgeMs) {
      unlinkSync(filePath);
    }
  }
};

ensureLogsDirectory();
removeExpiredLogs("error-", 7);
removeExpiredLogs("info-", 30);

export const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: infoLogPath, level: "info" }),
    new transports.File({ filename: errorLogPath, level: "error" })
  ]
});
