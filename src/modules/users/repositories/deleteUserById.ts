import { User } from "@schemas/models";
import { DeletedStatus } from "@plugins/common/types";

export const deleteUserById = async (id: string, deletedStatus = DeletedStatus.TRUE) => {
	const [affected] = await User.update(
		{ deleted: deletedStatus },
		{
			where: {
				id,
				deleted: DeletedStatus.FALSE
			}
		}
	);

	return affected;
};
