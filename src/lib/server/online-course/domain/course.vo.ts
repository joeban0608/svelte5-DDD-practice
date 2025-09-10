import z from 'zod';

export class CourseId {
	private static readonly schema = z.string().uuid();
	public constructor(public readonly value: string) {}
	public static create(value: string): CourseId {
		return new CourseId(this.schema.parse(value));
	}
}

export class CourseName {
	private static readonly schema = z.string().min(1).max(100);
	public constructor(public readonly value: string) {}
	public static create(value: string): CourseName {
		return new CourseName(this.schema.parse(value));
	}
}

export class CourseDescription {
	private static readonly schema = z.string().max(500);
	public constructor(public readonly value: string) {}
	public static create(value: string): CourseDescription {
		return new CourseDescription(this.schema.parse(value));
	}
}

export class CourseStudentCountRange {
	private static readonly schema = z
		.object({
			min: z.number().min(1),
			max: z.number().min(1)
		})
		.refine((data) => data.max >= data.min, {
			message: 'max must be greater than or equal to min'
		});
	public constructor(public readonly value: { min: number; max: number }) {}
	public static create(value: { min: number; max: number }): CourseStudentCountRange {
		return new CourseStudentCountRange(this.schema.parse(value));
	}
}
