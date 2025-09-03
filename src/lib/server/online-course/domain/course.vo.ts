import z from 'zod';

export class CourseId {
	private static readonly schema = z.string().uuid();
	constructor(public readonly value: string) {}
	public static create(value: string): CourseId {
		return new CourseId(this.schema.parse(value));
	}
}

export class CourseTitle {
	private static readonly schema = z.string().min(2).max(100);
	constructor(public readonly value: string) {}
	public static create(value: string): CourseTitle {
		return new CourseTitle(this.schema.parse(value));
	}
}

export class CourseDescription {
	private static readonly schema = z.string().min(10).max(1000);
	constructor(public readonly value: string) {}
	public static create(value: string): CourseDescription {
		return new CourseDescription(this.schema.parse(value));
	}
}

export class CourseStudentCountRange {
	private static readonly schema = z.object({
		min: z.number().min(20),
		max: z.number().max(60)
	});
	constructor(public readonly value: { min: number; max: number }) {}
	public static create(value: { min: number; max: number }): CourseStudentCountRange {
		return new CourseStudentCountRange(this.schema.parse(value));
	}
}

export class CoursePeriod {
	private static readonly schema = z
		.object({
			start: z.number().min(Date.now() + 1000 * 60 * 60 * 24 * 7),
			end: z.number()
		})
		.refine((data) => data.end > data.start + 1000 * 60 * 60 * 24 * 90, {
			message: 'Course period must be at least 90 days'
		});
	constructor(public readonly value: { start: number; end: number }) {}
	public static create(value: { start: number; end: number }): CoursePeriod {
		return new CoursePeriod(this.schema.parse(value));
	}
}

export enum EnumCourseStatus {
	PENDING = 'PENDING',
	IN_PROGRESS = 'IN_PROGRESS',
	COMPLETED = 'COMPLETED',
	CANCELLED = 'CANCELLED'
}

export class CourseStatus {
	private static readonly schema = z.enum([
		EnumCourseStatus.PENDING,
		EnumCourseStatus.IN_PROGRESS,
		EnumCourseStatus.COMPLETED,
		EnumCourseStatus.CANCELLED
	]);
	constructor(public readonly value: EnumCourseStatus) {}
	public static create(value: EnumCourseStatus): CourseStatus {
		return new CourseStatus(this.schema.parse(value));
	}
}
