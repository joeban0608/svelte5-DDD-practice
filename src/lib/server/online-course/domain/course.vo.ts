import z from 'zod';

export class CourseId {
	private static readonly schema = z.string().uuid();
	constructor(public readonly value: string) {}
	public static create(value: string) {
		return new CourseId(this.schema.parse(value));
	}
}

export class CourseName {
	private static readonly schema = z.string();
	constructor(public readonly value: string) {}
	public static create(value: string) {
		return new CourseName(this.schema.parse(value));
	}
}

export class CourseDescription {
	private static readonly schema = z.string().max(500);
	constructor(public readonly value: string) {}
	public static create(value: string) {
		return new CourseDescription(this.schema.parse(value));
	}
}

export class CourseStudentCountRange {
  private static readonly schema = z.object({
    min: z.number().min(1),
    max: z.number().min(1)
  });
  constructor(public readonly value: { min: number; max: number }) {}
  public static create(value: { min: number; max: number }) {
    return new CourseStudentCountRange(this.schema.parse(value));
  }
}