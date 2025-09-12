import type { UserAggregate } from './user.ag';

export interface IUserQueryRepository {
	findById(id: string): Promise<UserAggregate | null>;
	list(): Promise<UserAggregate[]>;
	findOne(): Promise<UserAggregate | null>;
	getPermissionList(userId: string): Promise<string[]>;
}
