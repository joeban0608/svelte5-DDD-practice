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

/* 
	- 更新事件應該有多種策略，例如：
			1. 取消課程（status 不能是, completed, cancelled)
			2. 開啟課程 (status 只能是 pending)
			3. 更新課程價格 (status 只能是 pending)
*/
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

	public static cancel(primitive: CourseProps) {
		if (primitive.status.value !== EnumCourseStatus.PENDING) {
			throw new Error('Only courses with status "pending" can be cancelled.');
		}
		return new CourseAggregate({
			...primitive,
			status: CourseStatus.create(EnumCourseStatus.CANCELLED)
		});
	}

	public static start(primitive: CourseProps) {
		if (primitive.status.value !== EnumCourseStatus.PENDING) {
			throw new Error('Only courses with status "pending" can be started.');
		}
		return new CourseAggregate({
			...primitive,
			status: CourseStatus.create(EnumCourseStatus.IN_PROGRESS)
		});
	}
}
