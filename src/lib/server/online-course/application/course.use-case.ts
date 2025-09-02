import { CourseAggregate, type CourseProps } from '../domain/course.ag';
import {
	CourseDescription,
	CoursePeriod,
	CoursePrice,
	CourseStatus,
	CourseStudentCountRange,
	CourseTitle,
	EnumCourseStatus
} from '../domain/course.vo';
import type { ICourseRepository } from '../domain/i-course.repo';
import { MockCourseRepo } from '../infrastructure/mock-course.repo';

export class CourseUseCase {
	constructor(private readonly _repo: ICourseRepository) {}

	async getCourse(id: string) {
		return this._repo.findCourse(id);
	}

	async listCourses() {
		return this._repo.listCourses();
	}

	async createCourse(input: Omit<CourseProps, 'id' | 'createdAt'>) {
		const course = CourseAggregate.create(input);
		await this._repo.saveCourse(course);
		return course;
	}

	async deleteCourse(id: string) {
		await this._repo.deleteCourse(id);
		return id;
	}

	async updateCourseField(id: string, patch: Partial<Omit<CourseProps, 'id' | 'createdAt'>>) {
		const found = await this._repo.findCourse(id);
		if (!found) throw new Error('Course not found');
		// 用新的 CourseAggregate 或 merge 欄位
		const updateCourseProps = { ...found.props, ...patch };
		const updatedCourse = CourseAggregate.from(updateCourseProps);
		await this._repo.saveCourse(updatedCourse);
		return updatedCourse;
	}
}

export async function _main_() {
	const mockRepo = new MockCourseRepo();
	const uc = new CourseUseCase(mockRepo);

	const startDate = Date.now() + 1000 * 60 * 60 * 24 * 14;
	const newCourse = await uc.createCourse({
		title: CourseTitle.create('new Course'),
		description: CourseDescription.create('This is a new course description'),
		studentCountRange: CourseStudentCountRange.create({ min: 20, max: 60 }),
		period: CoursePeriod.create({ start: startDate, end: startDate + 1000 * 60 * 60 * 24 * 91 }),
		price: CoursePrice.create(200),
		status: CourseStatus.create(EnumCourseStatus.PENDING)
	});
	await uc.createCourse({
		title: CourseTitle.create('new Course 2'),
		description: CourseDescription.create('This is a new course description 2'),
		studentCountRange: CourseStudentCountRange.create({ min: 30, max: 50 }),
		period: CoursePeriod.create({ start: startDate, end: startDate + 1000 * 60 * 60 * 24 * 91 }),
		price: CoursePrice.create(300),
		status: CourseStatus.create(EnumCourseStatus.PENDING)
	});

	const findCourse = await uc.getCourse(newCourse.props.id.value);
	let listCourse: CourseAggregate[] = [];
	listCourse = await uc.listCourses();

	console.log('newCourse', newCourse);
	console.log('mockRepo', mockRepo);
	console.log('findCourse', findCourse);
	console.log('listCourse', {
		raw_data: listCourse,
		JSON_data: JSON.stringify(listCourse)
	});

	if (findCourse) {
		console.log('--- updateCourseField ---', findCourse);
		await uc.updateCourseField(findCourse.props.id.value, {
			title: CourseTitle.create('updated Course Title'),
			description: CourseDescription.create('updated Course Description')
		});
	}

	const updateCourse = await uc.getCourse(newCourse.props.id.value);
	console.log('updateCourse', {
		raw_data: updateCourse,
		JSON_data: JSON.stringify(updateCourse)
	});

	const deletedCourse = await uc.deleteCourse(newCourse.props.id.value);

	if (deletedCourse) {
		console.log('Course deleted successfully:', deletedCourse);
	} else {
		console.log('Course deletion failed:', deletedCourse);
	}

	listCourse = await uc.listCourses();
  console.log('after delete - listCourse', {
    raw_data: listCourse,
    JSON_data: JSON.stringify(listCourse)
  });
}
