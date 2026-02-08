import { Role, User } from "@schemas/models";

export const findUserById = (id: number) =>
  User.findByPk(id, {
    include: [{ model: Role, as: "role", attributes: ["id", "name"] }]
  });
