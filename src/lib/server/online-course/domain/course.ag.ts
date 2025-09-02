// import type { CourseId, CourseTitle } from './common.vo';
import { CreatedAt } from '$lib/server/_shard/shard.vo';
import {
	CourseDescription,
	CourseId,
	CoursePeriod,
	CoursePrice,
	CourseStatus,
	CourseStudentCountRange,
	CourseTitle
	// EnumCourseStatus
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

export type CourseProps = {
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
			createdAt: CreatedAt.create(Date.now())
		});
	}

	public static from(primitive: CourseProps) {
		return new CourseAggregate(primitive);
	}
}
