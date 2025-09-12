import z from 'zod';

export class CreatedAt {
	private static readonly schema = z.number().int().positive();
	private constructor(public readonly value: number) {}
	public static create(value: number): CreatedAt {
		return new CreatedAt(this.schema.parse(value));
	}
}

export class UpdatedAt {
	private static readonly schema = z.number().int().positive();
	private constructor(public readonly value: number) {}
	public static create(value: number): UpdatedAt {
		return new UpdatedAt(this.schema.parse(value));
	}
}
