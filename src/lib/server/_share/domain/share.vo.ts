import z from 'zod';

export class CreatedAt {
	private static readonly schema = z.number();
	constructor(public readonly value: number) {}
	public static create(value: number) {
		return new CreatedAt(this.schema.parse(value));
	}
}
