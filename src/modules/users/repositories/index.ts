import { findUsersDatatable } from "@modules/users/repositories/findUsersDatatable";
import { createUser } from "@modules/users/repositories/createUser";
import { findUserById } from "@modules/users/repositories/findUserById";
import { findUserByEmail } from "@modules/users/repositories/findUserByEmail";
import { findRoleByName } from "@modules/users/repositories/findRoleByName";
import { updateUserById } from "@modules/users/repositories/updateUserById";
import { deleteUserById } from "@modules/users/repositories/deleteUserById";

export const usersRepository = {
  findUsersDatatable,
  createUser,
  findUserById,
  findUserByEmail,
  findRoleByName,
  updateUserById,
  deleteUserById
};
