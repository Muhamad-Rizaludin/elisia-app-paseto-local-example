import { User } from "@schemas/models";
import { DeletedStatus } from "@plugins/common/types";

export const findUserByEmail = (
	email: string,
	options?: { includeDeleted?: boolean }
) => {
	const includeDeleted = options?.includeDeleted === true;

	const where = includeDeleted
		? { email }
		: {
			email,
			deleted: DeletedStatus.FALSE
		};

	return User.findOne({
		where
	});
};
