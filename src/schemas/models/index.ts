import type { Sequelize } from "sequelize";
import { Role, initializeRoleModel } from "@schemas/models/Role";
import { User, initializeUserModel } from "@schemas/models/User";
import { RefreshToken, initializeRefreshTokenModel } from "@schemas/models/RefreshToken";

export const initModels = (sequelize: Sequelize) => {
  initializeRoleModel(sequelize);
  initializeUserModel(sequelize);
  initializeRefreshTokenModel(sequelize);
};

export { Role, User, RefreshToken };
