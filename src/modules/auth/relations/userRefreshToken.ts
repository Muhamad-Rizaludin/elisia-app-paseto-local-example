import { RefreshToken, User } from "@schemas/models";

export const applyUserRefreshTokenRelation = () => {
  RefreshToken.belongsTo(User, {
    foreignKey: "userId",
    as: "user"
  });

  User.hasMany(RefreshToken, {
    foreignKey: "userId",
    as: "refreshTokens"
  });
};
