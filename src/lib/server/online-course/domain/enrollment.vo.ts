import { z } from 'zod';

export class EnrollmentId {
	private static readonly schema = z.string().uuid();
	constructor(public readonly value: string) {}
	public static create(value: string): EnrollmentId {
		return new EnrollmentId(this.schema.parse(value));
	}
}
