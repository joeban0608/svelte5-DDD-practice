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

/**
 * CourseUseCase
 * 應該遵循 repo > ag > ag.operation > repo 流程
 */
export class CourseUseCase {
	constructor(private readonly _repo: ICourseRepository) {}

	async getCourse(id: string) {
		const found = await this._repo.findCourse(id);
		if (!found) throw new Error('Course not found');
		const ag = CourseAggregate.from(found.props);
		return ag.props;
	}

	async listCourses() {
		const foundList = await this._repo.listCourses();
		const agList = foundList.map((course) => CourseAggregate.from(course.props));
		return agList;
	}

	async createCourse(input: Omit<CourseProps, 'id' | 'createdAt'>) {
		const ag = CourseAggregate.create(input);
		await this._repo.saveCourse(ag);
		return {
			id: ag.props.id.value
		};
	}

	async deleteCourse(id: string) {
		const found = await this._repo.findCourse(id);
		if (!found) throw new Error('Course not found');
		const ag = CourseAggregate.from(found.props);
		await this._repo.deleteCourse(ag.props.id.value);
		return {
			id: ag.props.id.value
		};
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
	const newCourseResult = await uc.createCourse({
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

	if (!newCourseResult.id) {
		throw new Error('Course creation failed');
	}
	const findCourse = await uc.getCourse(newCourseResult.id);
	let listCourse: CourseAggregate[] = [];
	listCourse = await uc.listCourses();

	console.log('newCourseResult', newCourseResult.id);
	console.log('mockRepo', mockRepo);
	console.log('findCourse', findCourse);
	console.log('listCourse', {
		raw_data: listCourse,
		JSON_data: JSON.stringify(listCourse)
	});

	if (findCourse) {
		await uc.updateCourseField(findCourse.id.value, {
			title: CourseTitle.create('updated Course Title'),
			description: CourseDescription.create('updated Course Description')
		});
	}

	const updateCourse = await uc.getCourse(newCourseResult.id);
	console.log('updateCourse', {
		raw_data: updateCourse,
		JSON_data: JSON.stringify(updateCourse)
	});

	const deletedCourseResult = await uc.deleteCourse(newCourseResult.id);
	if (!deletedCourseResult.id) {
		throw new Error('Course deletion failed');
	}
	console.log('Course deleted successfully:', deletedCourseResult);

	listCourse = await uc.listCourses();
	console.log('after delete - listCourse', {
		raw_data: listCourse,
		JSON_data: JSON.stringify(listCourse)
	});
}
