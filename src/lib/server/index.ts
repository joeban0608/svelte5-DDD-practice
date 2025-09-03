import { CourseAggregate } from './online-course/domain/course.ag';
import {
	CourseDescription,
	CoursePeriod,
	CourseStatus,
	CourseStudentCountRange,
	CourseTitle,
	EnumCourseStatus
} from './online-course/domain/course.vo';

export async function _main_() {
	try {
		const startDate = Date.now() + 1000 * 60 * 60 * 24 * 14;
		const course = CourseAggregate.create({
			title: CourseTitle.create('new Course'),
			description: CourseDescription.create('This is a new course description'),
			studentCountRange: CourseStudentCountRange.create({ min: 20, max: 60 }),
			period: CoursePeriod.create({ start: startDate, end: startDate + 1000 * 60 * 60 * 24 * 120 }),
			status: CourseStatus.create(EnumCourseStatus.PENDING)
		});

		console.log('*'.repeat(100) + '\n' + 'course', {
			raw_data: course,
			JSON_data: JSON.stringify(course)
		});
	} catch (error) {
		console.error('*'.repeat(100) + '\n' + 'Error occurred when processing courses:', error);
	}
}
