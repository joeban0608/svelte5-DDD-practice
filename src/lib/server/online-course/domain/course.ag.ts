// import type { CourseId, CourseTitle } from './common.vo';
import { CreatedAt } from '$lib/server/_shard/shard.vo';
import {
	CourseDescription,
	CourseEndDate,
	CourseId,
	CourseMaxStudents,
	CourseMinStudents,
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
	👌 public startDate: number, // 開課時間
	👌 public endDate: number, // 結束時間
	👌 public createdAt: number,
	👌 public status: "pending" | "in_progress" | "completed" | "cancelled"
*/

type CourseProps = {
	id: CourseId;
	title: CourseTitle;
	description: CourseDescription;
	minStudents: CourseMinStudents;
	maxStudents: CourseMaxStudents;
	startDate: CourseStartDate;
	endDate: CourseEndDate;
	createdAt: CreatedAt;
	status: CourseStatus;
};

export class CourseAggregate {
	private constructor(public readonly props: CourseProps) {}

	public static create(props: Omit<CourseProps, 'id' | 'createdAt'>): CourseAggregate {
		// return new CourseAggregate({ ...props, createdAt: new Date() });
		return new CourseAggregate({
			...props,
			id: CourseId.create(crypto.randomUUID()),
			createdAt: CreatedAt.create()
		});
	}
}
