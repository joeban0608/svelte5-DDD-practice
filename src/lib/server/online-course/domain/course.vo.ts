import z from 'zod';
/* 
	value object 不能給予設值, 不然會造成 entity.create or ag.create時, 從 db 拿回來的資料會被覆蓋掉
*/
export class CourseId {
	private static readonly schema = z.uuid();
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

interface ICourseStudentCountRange {
	min: number;
	max: number;
}

export class CourseStudentCountRange {
	private static readonly schema = z.object({
		min: z.number().min(20),
		max: z.number().max(60)
	});
	constructor(public readonly value: ICourseStudentCountRange) {}
	public static create(value: ICourseStudentCountRange) {
		return new CourseStudentCountRange(this.schema.parse(value));
	}
}

export class CoursePrice {
	private static readonly schema = z.number().min(200);
	constructor(public readonly value: number) {}
	public static create(value: number) {
		return new CoursePrice(this.schema.parse(value));
	}
}

export class CoursePeriod {
	private static readonly schema = z.object({
		start: z.number().min(Date.now() + 1000 * 60 * 60 * 24 * 7),
		end: z.number()
	});
	constructor(public readonly value: { start: number; end: number }) {}
	public static create(value: { start: number; end: number }) {
		const schema = CoursePeriod.schema.refine(
			(val) => val.end > val.start + 1000 * 60 * 60 * 24 * 90,
			{
				message: 'End date must be greater than start date'
			}
		);
		return new CoursePeriod(schema.parse(value));
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
		EnumCourseStatus.IN_PROGRESS,
		EnumCourseStatus.COMPLETED,
		EnumCourseStatus.CANCELLED
	]);
	constructor(public readonly value: EnumCourseStatus) {}
	public static create(value: EnumCourseStatus) {
		return new CourseStatus(this.schema.parse(value));
	}
}
