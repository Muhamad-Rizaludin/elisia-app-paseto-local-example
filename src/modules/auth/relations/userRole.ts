import { Role, User } from "@schemas/models";

export const applyUserRoleRelation = () => {
  User.belongsTo(Role, {
    foreignKey: "roleId",
    as: "role"
  });

  Role.hasMany(User, {
    foreignKey: "roleId",
    as: "users"
  });
};
