import { Role, User } from "@schemas/models";

export const findUserByEmail = (email: string) =>
  User.findOne({
    where: { email },
    include: [{ model: Role, as: "role", attributes: ["id", "name"] }]
  });
