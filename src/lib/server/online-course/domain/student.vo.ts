import z from 'zod';
export class StudentId {
	private static readonly schema = z.string().uuid();
	constructor(public readonly value: string) {}
	public static create(value: string): StudentId {
		return new StudentId(this.schema.parse(value));
	}
}

export class StudentName {
	private static readonly schema = z.string();
	constructor(public readonly value: string) {}
	public static create(value: string): StudentName {
		return new StudentName(this.schema.parse(value));
	}
}

export class StudentEmail {
	private static readonly schema = z.string().email();
	constructor(public readonly value: string) {}
	public static create(value: string): StudentEmail {
		return new StudentEmail(this.schema.parse(value));
	}
}
