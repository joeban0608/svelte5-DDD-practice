// import type { CourseId, CourseTitle } from './common.vo';
import { CreatedAt } from '$lib/server/_shard/shard.vo';
import {
	CourseDescription,
	CourseEndDate,
	CourseId,
	CourseMaxStudents,
	CourseMinStudents,
	CoursePrice,
	CourseStartDate,
	CourseStatus,
	CourseTitle
} from './course.vo';

/*
	
	👌 public readonly id: string,
	public readonly teacher: Teacher, // 可以是 Teacher Entity 或 TeacherId
	private students: Student[] = [], // 或 StudentId[]
	👌 public title: string,
	👌 public description: string,
	👌 public readonly minStudents: number,
	👌 public readonly maxStudents: number,
	👌 public readonly price: number,
	👌 public startDate: number, // 開課時間
	👌 public endDate: number, // 結束時間
	👌 public createdAt: number,
	👌 public status: "pending" | "started" | "in_progress" | "completed" | "cancelled"
*/

type CourseProps = {
	id: CourseId;
	title: CourseTitle;
	description: CourseDescription;
	minStudents: CourseMinStudents;
	maxStudents: CourseMaxStudents;
	price: CoursePrice;
	startDate: CourseStartDate;
	endDate: CourseEndDate;
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
		minStudents: CourseMinStudents.create(),
		maxStudents: CourseMaxStudents.create(),
		startDate: CourseStartDate.create(startDate),
		endDate: CourseEndDate.create(Date.now() + 1000 * 60 * 60 * 24 * 120, startDate),
		price: CoursePrice.create(),
		status: CourseStatus.create()
	});

	console.log('course', course);
}
