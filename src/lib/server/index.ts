import { CourseUseCase } from './online-course/application/course.use-case';
import { CourseAggregate } from './online-course/domain/course.ag';
import {
	CourseDescription,
	CoursePeriod,
	CourseStatus,
	CourseStudentCountRange,
	CourseTitle,
	EnumCourseStatus
} from './online-course/domain/course.vo';
import { MockCourseRepo } from './online-course/infrastructure/mock-course.repo';

export async function _main_() {
	try {
		const courseData = new Map();
		const mockRepo = new MockCourseRepo(courseData);
		const uc = new CourseUseCase(mockRepo);
		const startDate = Date.now() + 1000 * 60 * 60 * 24 * 14;

		const createNewCourseResult = await uc.createCourse({
			title: CourseTitle.create('new Course'),
			description: CourseDescription.create('This is a new course description'),
			studentCountRange: CourseStudentCountRange.create({ min: 20, max: 60 }),
			period: CoursePeriod.create({ start: startDate, end: startDate + 1000 * 60 * 60 * 24 * 91 }),
			status: CourseStatus.create(EnumCourseStatus.PENDING)
		});
		await uc.createCourse({
			title: CourseTitle.create('new Course 2'),
			description: CourseDescription.create('This is a new course description 2'),
			studentCountRange: CourseStudentCountRange.create({ min: 30, max: 50 }),
			period: CoursePeriod.create({ start: startDate, end: startDate + 1000 * 60 * 60 * 24 * 91 }),
			status: CourseStatus.create(EnumCourseStatus.PENDING)
		});

		let findCourse: CourseAggregate | null = null;
		let listCourse: CourseAggregate[] = [];
		listCourse = await uc.listCourses();
		console.log('*'.repeat(100) + '\n' + 'listCourse', {
			raw_data: listCourse,
			JSON_data: JSON.stringify(listCourse)
		});

		const updateCourse = await uc.getCourse(createNewCourseResult.props.id.value);
		console.log('*'.repeat(100) + '\n' + 'updateCourse', {
			raw_data: updateCourse,
			JSON_data: JSON.stringify(updateCourse)
		});

		findCourse = await uc.getCourse(createNewCourseResult.props.id.value);
		if (findCourse) {
			console.log('*'.repeat(100) + '\n' + 'find course after updated', findCourse);
			await uc.updateCourseField(findCourse.props.id.value, {
				title: CourseTitle.create('updated Course Title'),
				description: CourseDescription.create('updated Course Description')
			});
		}

		const deletedCourse = await uc.deleteCourse(createNewCourseResult.props.id.value);

		if (deletedCourse) {
			console.log('*'.repeat(100) + '\n' + 'Course deleted successfully:', deletedCourse);
		} else {
			console.log('*'.repeat(100) + '\n' + 'Course deletion failed:', deletedCourse);
		}

		listCourse = await uc.listCourses();
		console.log('*'.repeat(100) + '\n' + 'after delete - listCourse', {
			raw_data: listCourse,
			JSON_data: JSON.stringify(listCourse)
		});
	} catch (error) {
		console.error('*'.repeat(100) + '\n' + 'Error occurred when processing courses:', error);
	}
}
