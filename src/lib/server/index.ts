import { MockUserCommandService } from './user-system/application/user.cs';
import { MockUserQueryService } from './user-system/application/user.qs';
import { MockUserCommandRepository } from './user-system/infrastructure/mock-user.cr';
import { MockUserQueryRepository } from './user-system/infrastructure/mock-user.qr';
import { MockUserUnitOfWork } from './user-system/infrastructure/mock-user.uow';

export async function __main__() {
	try {
		const userData = new Map();
		const mockUserQr = new MockUserQueryRepository(userData);
		const mockUserUow = new MockUserUnitOfWork(mockUserQr, userData);
		const mockUserQs = new MockUserQueryService(mockUserUow);
		const mockUserCs = new MockUserCommandService(mockUserUow);

		const register_user_1_result = await mockUserCs.registerUser(
			'user1',
			'joeban@haiman.com',
			'password1',
		);

		console.log(
			'*'.repeat(100) + '\n' + 'register_user_1_result :',
			JSON.stringify(register_user_1_result)
		);
	} catch (error) {
		console.error('*'.repeat(100) + '\n' + 'Error occurred :', error);
	}
}
