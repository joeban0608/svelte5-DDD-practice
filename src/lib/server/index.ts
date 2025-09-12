import { CourseCommandService } from './online-course/application/course.cs';
import { CourseQueryService } from './online-course/application/course.qs';
import type { CourseAggregate } from './online-course/domain/course.ag';
import { CourseAdapter } from './online-course/infrastructure/course.ad';
import { MockCourseQueryRepository } from './online-course/infrastructure/mock-course.qr';
import { MockCourseUnitOfWork } from './online-course/infrastructure/mock-course.uow';
import { UserCommandService } from './user-system/application/user.cs';
import { UserQueryService } from './user-system/application/user.qs';
import { UserAggregate } from './user-system/domain/user.ag';
import { MockUserQueryRepository } from './user-system/infrastructure/mock-user.qr';
import { MockUserUnitOfWork } from './user-system/infrastructure/mock-user.uow';

async function __user__() {
	try {
		const userData = new Map();
		const courseAdapter = new CourseAdapter();

		const mockUserQr = new MockUserQueryRepository(userData);
		const mockUserUow = new MockUserUnitOfWork(mockUserQr, userData);
		const userQs = new UserQueryService(mockUserUow);
		const userCs = new UserCommandService(mockUserUow, courseAdapter);

		let findUser: UserAggregate | null = null;
		let listUsers: UserAggregate[] = [];

		const register_user_1_result = await userCs.registerUser({
			name: 'user1',
			email: 'joeban@haiman.com',
			password: 'password1',
			courseRole: 'student'
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
			password: 'password2',
			courseRole: 'student'
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

async function __course__() {
	try {
		// to be implemented
		const courseData = new Map();
		const courseAdapter = new CourseAdapter();

		const mockCourseQr = new MockCourseQueryRepository(courseData);
		const mockCourseUow = new MockCourseUnitOfWork(mockCourseQr, courseData);
		const courseQs = new CourseQueryService(mockCourseUow);
		const courseCs = new CourseCommandService(mockCourseUow, courseAdapter);
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
		let findCourse: CourseAggregate | null = null;
		let listStudents: UserAggregate[] = [];
		// initial user
		const { userQs, userCs } = await __user__();
		await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second, 測試 updatedAt 變化

		// initial course
		const { courseQs, courseCs } = await __course__();
		await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second, 測試 updatedAt 變化

		console.log('*'.repeat(100) + '\n' + 'start add course :');

		/* 
			加入第一個學生 
			1. 找到學生
			2. 找到課程
			3. 將學生加入課程
		*/
		// findOneUser
		const find_one_user_result = await userQs.getOneUser();
		console.log('findOneUser :', JSON.stringify(find_one_user_result, null, 2));

		// findOneCourse
		const find_one_course_result = await courseQs.getOneCourse();
		console.log('findOneCourse :', JSON.stringify(find_one_course_result, null, 2));
		if (!find_one_user_result || !find_one_course_result) {
			throw new Error('No user or course found for enrollment');
		}

		// add student to course
		const add_student_result = await courseCs.addStudent({
			courseId: find_one_course_result.id.value,
			studentId: find_one_user_result.id.value,
			permissions: await userQs.getUserPermissions(find_one_user_result.id.value)
		});
		console.log(
			'*'.repeat(100) + '\n' + 'add_student_result :',
			JSON.stringify(add_student_result, null, 2)
		);

		findCourse = await courseQs.getCourse(add_student_result.courseId);

		await new Promise((resolve) => setTimeout(resolve, 1000));

		/* 
			加入第二個學生 
			1. 找到學生
			2. 找到課程
			3. 將學生加入課程
		*/
		console.log('*'.repeat(100) + '\n' + 'add another student');
		listStudents = await userQs.listUsers();
		const add_student_result_2 = await courseCs.addStudent({
			courseId: find_one_course_result.id.value,
			studentId: listStudents[1].id.value,
			permissions: await userQs.getUserPermissions(listStudents[1].id.value)
		});

		findCourse = await courseQs.getCourse(add_student_result_2.courseId);
		console.log('find course after add student :', JSON.stringify(findCourse, null, 2));

		await new Promise((resolve) => setTimeout(resolve, 1000));
		/* 
			加入第三個學生，應該要失敗，因為大於 max student count
		*/

		console.log('*'.repeat(100) + '\n' + 'add third student, must be failed');
		const register_user_3_result = await userCs.registerUser({
			name: 'user3',
			email: 'user3@example.com',
			password: 'password',
			courseRole: 'student'
		});
		console.log('register_user_3_result :', JSON.stringify(register_user_3_result));
		if (!register_user_3_result.id) {
			throw new Error('User registration failed');
		}

		const add_student_result_3 = await courseCs.addStudent({
			courseId: find_one_course_result.id.value,
			studentId: register_user_3_result.id,
			permissions: await userQs.getUserPermissions(register_user_3_result.id)
		});
		console.log('add_student_result_3 :', JSON.stringify(add_student_result_3, null, 2));

		findCourse = await courseQs.getCourse(add_student_result_3.courseId);
		console.log('find course after add student :', JSON.stringify(findCourse, null, 2));
	} catch (error) {
		console.error('*'.repeat(100) + '\n' + 'Error occurred :', error);
	}
}
