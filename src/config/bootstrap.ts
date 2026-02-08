import { sequelize, connectDatabase } from "@config/database";
import { initModels } from "@schemas/models";
import { registerRelations } from "@relations/index";

let initialized = false;

export const bootstrapDatabase = async () => {
  if (!initialized) {
    initModels(sequelize);
    registerRelations();
    initialized = true;
  }

  await connectDatabase();
};

export const closeDatabase = async () => {
  await sequelize.close();
};
