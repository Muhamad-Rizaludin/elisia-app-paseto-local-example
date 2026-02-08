import { applyUserRoleRelation } from "@modules/auth/relations/userRole";
import { applyUserRefreshTokenRelation } from "@modules/auth/relations/userRefreshToken";

export const registerRelations = () => {
  applyUserRoleRelation();
  applyUserRefreshTokenRelation();
};
