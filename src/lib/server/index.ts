import { CourseCommandService } from './online-course/application/course.cs';
import { CourseQueryService } from './online-course/application/course.qs';
import type { CourseAggregate } from './online-course/domain/course.ag';
import { MockCourseQueryRepository } from './online-course/infrastructure/mock-course.qr';
import { MockCourseUnitOfWork } from './online-course/infrastructure/mock-course.uow';
import { UserSystemAntiCorruptionLayerAdapter } from './online-course/infrastructure/user-system.acl.ad';
import { UserCommandService } from './user-system/application/user.cs';
import { UserQueryService } from './user-system/application/user.qs';
import { UserAggregate } from './user-system/domain/user.ag';
import { MockUserQueryRepository } from './user-system/infrastructure/mock-user.qr';
import { MockUserUnitOfWork } from './user-system/infrastructure/mock-user.uow';

async function __user__() {
	try {
		const userData = new Map();
		const mockUserQr = new MockUserQueryRepository(userData);
		const mockUserUow = new MockUserUnitOfWork(mockUserQr, userData);
		const userQs = new UserQueryService(mockUserUow);
		const userCs = new UserCommandService(mockUserUow);

		let findUser: UserAggregate | null = null;
		let listUsers: UserAggregate[] = [];

		const register_user_1_result = await userCs.registerUser({
			name: 'user1',
			email: 'joeban@haiman.com',
			password: 'password1'
		});

		console.log(
			'*'.repeat(100) + '\n' + 'register_user_1_result :',
			JSON.stringify(register_user_1_result)
		);
		if (!register_user_1_result.id) {
			throw new Error('User registration failed');
		}
		await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second, 測試 updatedAt 變化

		const register_user_2_result = await userCs.registerUser({
			name: 'user2',
			email: 'joeban2@haiman.com',
			password: 'password2'
		});

		console.log(
			'*'.repeat(100) + '\n' + 'register_user_2_result :',
			JSON.stringify(register_user_2_result)
		);
		if (!register_user_2_result.id) {
			throw new Error('User registration failed');
		}

		listUsers = await userQs.listUsers();
		console.log('*'.repeat(100) + '\n' + 'list users after register :', listUsers);

		await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second, 測試 updatedAt 變化

		const change_user_1_password_result = await userCs.changePassword({
			id: register_user_1_result.id,
			oldPassword: 'password1',
			newPassword: 'newpassword1'
		});

		console.log(
			'*'.repeat(100) + '\n' + 'change_use_1_password_result :',
			JSON.stringify(change_user_1_password_result)
		);
		if (!change_user_1_password_result.id) {
			throw new Error('Change password failed');
		}
		findUser = await userQs.getUser(change_user_1_password_result.id);
		console.log('find user after change password :', JSON.stringify(findUser));
		return {
			userQs,
			userCs
		};
	} catch (error) {
		throw new Error('*'.repeat(100) + '\n' + 'Error in __user__ function: ' + error);
	}
}

async function __course__(userQs: UserQueryService) {
	try {
		// to be implemented
		const courseData = new Map();
		const mockCourseQr = new MockCourseQueryRepository(courseData);
		const mockCourseUow = new MockCourseUnitOfWork(mockCourseQr, courseData);
		const courseQs = new CourseQueryService(mockCourseUow);
		const courseCs = new CourseCommandService(
			mockCourseUow,
			new UserSystemAntiCorruptionLayerAdapter(userQs)
		);
		let findCourse: CourseAggregate | null = null;
		const create_course_1_result = await courseCs.createCourse({
			name: 'course1',
			description: 'This is course 1',
			studentCountRange: { min: 1, max: 2 }
		});
		console.log(
			'*'.repeat(100) + '\n' + 'create_course_1_result :',
			JSON.stringify(create_course_1_result)
		);
		if (!create_course_1_result.id) {
			throw new Error('Course creation failed');
		}
		findCourse = await courseQs.getCourse(create_course_1_result.id);
		console.log('find course after create :', JSON.stringify(findCourse));
		return {
			courseCs,
			courseQs
		};
	} catch (error) {
		throw new Error('*'.repeat(100) + '\n' + 'Error in __course__ function: ' + error);
	}
}

export async function __main__() {
	try {
		// initial user
		const { userQs, userCs } = await __user__();
		await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second, 測試 updatedAt 變化

		// initial course
		const { courseQs, courseCs } = await __course__();
		await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second, 測試 updatedAt 變化

		console.log('*'.repeat(100) + '\n' + 'start add course :');

		// test findOneUser
		const find_one_user_result = await userQs.getOneUser();
		console.log('findOneUser :', JSON.stringify(find_one_user_result, null, 2));

		// test findOneCourse
		const find_one_course_result = await courseQs.getOneCourse();
		console.log('findOneCourse :', JSON.stringify(find_one_course_result, null, 2));
		if (!find_one_user_result || !find_one_course_result) {
			throw new Error('No user or course found for enrollment');
		}

		courseCs.addStudent();
	} catch (error) {
		console.error('*'.repeat(100) + '\n' + 'Error occurred :', error);
	}
}
