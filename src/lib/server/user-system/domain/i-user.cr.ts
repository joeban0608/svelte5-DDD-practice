import type { UserAggregate } from './user.ag';

export interface IUserCommandRepository {
	save(user: UserAggregate): Promise<void>;
	findById(id: string): Promise<UserAggregate | null>;
	findByEmail(email: string): Promise<UserAggregate | null>;
	delete(id: string): Promise<void>;
}
