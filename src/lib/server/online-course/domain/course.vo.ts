import z from 'zod';

export class CourseId {
	private static readonly schema = z.string().uuid();
	constructor(public readonly value: string) {}
	public static create(value: string) {
		return new CourseId(this.schema.parse(value));
	}

	public static random(): CourseId {
		const rid = crypto.randomUUID();
		return CourseId.create(rid);
	}
}

export class CourseTitle {
	private static readonly schema = z.string().min(2).max(100);
	constructor(public readonly value: string) {}
	public static create(value: string) {
		return new CourseTitle(this.schema.parse(value));
	}
}

export class CourseDescription {
	private static readonly schema = z.string().min(10).max(1000);
	constructor(public readonly value: string) {}
	public static create(value: string) {
		return new CourseDescription(this.schema.parse(value));
	}
}

export class CourseMinStudents {
	private static readonly schema = z.number().min(20);
	constructor(public readonly value: number) {}
	public static create(value: number = 20) {
		return new CourseMinStudents(this.schema.parse(value));
	}
}

export class CourseMaxStudents {
	private static readonly schema = z.number().max(60);
	constructor(public readonly value: number) {}
	public static create(value: number = 60) {
		return new CourseMaxStudents(this.schema.parse(value));
	}
}

export class CoursePrice {
	private static readonly schema = z.number().min(200);
	constructor(public readonly value: number) {}
	public static create(value: number = 200) {
		return new CoursePrice(this.schema.parse(value));
	}
}

export class CourseStartDate {
	private static readonly schema = z.number().min(Date.now() + 1000 * 60 * 60 * 24 * 7);
	constructor(public readonly value: number) {}
	public static create(value: number) {
		return new CourseStartDate(this.schema.parse(value));
	}
}

// CourseEndDate 至少要大於 startDate + 90 天
export class CourseEndDate {
	private static readonly schema = z.number();
	constructor(public readonly value: number) {}
	public static create(value: number, startDate: number) {
		const schema = CourseEndDate.schema.refine(
			(val) => val > startDate + 1000 * 60 * 60 * 24 * 90,
			{
				message: 'End date must be greater than start date'
			}
		);
		return new CourseEndDate(schema.parse(value));
	}
}

// 	public status: "pending" | "started" | "in_progress" | "completed" | "cancelled"
export enum EnumCourseStatus {
	PENDING = 'PENDING',
	STARTED = 'STARTED',
	IN_PROGRESS = 'IN_PROGRESS',
	COMPLETED = 'COMPLETED',
	CANCELLED = 'CANCELLED'
}

export class CourseStatus {
	private static readonly schema = z.enum([
		EnumCourseStatus.PENDING,
		EnumCourseStatus.STARTED,
		EnumCourseStatus.IN_PROGRESS,
		EnumCourseStatus.COMPLETED,
		EnumCourseStatus.CANCELLED
	]);
	constructor(public readonly value: EnumCourseStatus) {}
	public static create(value: EnumCourseStatus = EnumCourseStatus.PENDING) {
		return new CourseStatus(this.schema.parse(value));
	}
}
