import { CourseAggregate } from './online-course/domain/course.ag';
import {
	CourseDescription,
	CourseEndDate,
	CourseMaxStudents,
	CourseMinStudents,
	CourseStartDate,
	CourseStatus,
	CourseTitle
} from './online-course/domain/course.vo';

export async function _main_() {
	const startDate = Date.now() + 1000 * 60 * 60 * 24 * 14;
	const course = CourseAggregate.create({
		title: CourseTitle.create('new Course'),
		description: CourseDescription.create('This is a new course description'),
		minStudents: CourseMinStudents.create(),
		maxStudents: CourseMaxStudents.create(),
		startDate: CourseStartDate.create(startDate),
		endDate: CourseEndDate.create(Date.now() + 1000 * 60 * 60 * 24 * 120, startDate),
		status: CourseStatus.create()
	});

	console.log('course', course);
}
