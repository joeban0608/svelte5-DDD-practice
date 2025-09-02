// import type { CourseId, CourseTitle } from './common.vo';
import { CreatedAt } from '$lib/server/_shard/shard.vo';
import {
	CourseDescription,
	CourseId,
	CoursePeriod,
	CoursePrice,
	CourseStatus,
	CourseStudentCountRange,
	CourseTitle,
	EnumCourseStatus
} from './course.vo';

/*
	
	👌 public readonly id: string,
	public readonly teacher: Teacher, // 可以是 Teacher Entity 或 TeacherId
	private students: Student[] = [], // 或 StudentId[]
	👌 public readonly title: string,
	👌 public readonly description: string,
	👌 public readonly studentCountRange: { min: number; max: number },
	👌 public readonly price: number,
	👌 public readonly period: { start: number; end: number }, // end must > start + 90day
	👌 public readonly createdAt: number,
	👌 public readonly status: "pending" | "started" | "in_progress" | "completed" | "cancelled"
*/

type CourseProps = {
	id: CourseId;
	title: CourseTitle;
	description: CourseDescription;
	studentCountRange: CourseStudentCountRange;
	price: CoursePrice;
	period: CoursePeriod;
	createdAt: CreatedAt;
	status: CourseStatus;
};

export class CourseAggregate {
	private constructor(public readonly props: CourseProps) {}

	public static create(props: Omit<CourseProps, 'id' | 'createdAt'>) {
		// return new CourseAggregate({ ...props, createdAt: new Date() });
		return new CourseAggregate({
			...props,
			id: CourseId.random(),
			createdAt: CreatedAt.create()
		});
	}
}

export function _main_() {
	const startDate = Date.now() + 1000 * 60 * 60 * 24 * 14;
	const course = CourseAggregate.create({
		title: CourseTitle.create('new Course'),
		description: CourseDescription.create('This is a new course description'),
		studentCountRange: CourseStudentCountRange.create({ min: 20, max: 60 }),
		period: CoursePeriod.create({ start: startDate, end: startDate + 1000 * 60 * 60 * 24 * 91 }),
		price: CoursePrice.create(200),
		status: CourseStatus.create(EnumCourseStatus.PENDING)
	});

	console.log('course', {
		rawData: course,
		JSONData: JSON.stringify(course)
	});
}
