import { Role } from "@schemas/models";

export const findRoleByName = (name: string) => Role.findOne({ where: { name } });
