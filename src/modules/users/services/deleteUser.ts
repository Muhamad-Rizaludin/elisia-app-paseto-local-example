import { notFoundError } from "@common/errorFactory";
import { usersRepository } from "@modules/users/repositories";
import { DeletedStatus } from "@plugins/common/types";

export const deleteUser = async (id: number, deps = usersRepository) => {
  const deletedCount = await deps.deleteUserById(id, DeletedStatus.TRUE);
  if (!deletedCount) {
    throw notFoundError("User not found");
  }
};
