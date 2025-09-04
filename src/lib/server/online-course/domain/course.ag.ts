import { CreatedAt } from '$lib/server/_shard/shard.vo';
import {
	CourseDescription,
	CourseId,
	CoursePeriod,
	CourseStatus,
	CourseStudentCountRange,
	CourseTitle,
	EnumCourseStatus
} from './course.vo';

/*
	
	👌 public readonly id: string,
	public readonly teacher: Teacher, // 可以是 Teacher Entity 或 TeacherId
	private students: Student[] = [], // 或 StudentId[]
	👌 public title: string,
	👌 public description: string,
	👌 public studentCountRange: { min: number; max: number },
	👌 public period: { start: number; end: number },
	👌 public createdAt: number,
	👌 public status: "pending" | "in_progress" | "completed" | "cancelled"
*/

export type CourseProps = {
	id: CourseId;
	title: CourseTitle;
	description: CourseDescription;
	studentCountRange: CourseStudentCountRange;
	period: CoursePeriod;
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

	public static from(primitive: CourseProps): CourseAggregate {
		return new CourseAggregate(primitive);
	}

	public start(): void {
		if (this.props.status.value !== EnumCourseStatus.PENDING) {
			throw new Error('Only courses with status "pending" can be started.');
		}
		this.props.status = CourseStatus.create(EnumCourseStatus.IN_PROGRESS);
	}

	public cancel(): void {
		if (this.props.status.value !== EnumCourseStatus.PENDING) {
			throw new Error('Only courses with status "in_progress" can be cancelled.');
		}
		this.props.status = CourseStatus.create(EnumCourseStatus.CANCELLED);
	}
}
