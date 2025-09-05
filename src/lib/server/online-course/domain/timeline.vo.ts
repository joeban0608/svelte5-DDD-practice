import z from 'zod';

export class TimelineId {
	private static readonly schema = z.string().uuid();
	constructor(public readonly value: string) {}
	public static create(value: string) {
		return new TimelineId(this.schema.parse(value));
	}
}

export class TimelineDay {
	private static readonly schema = z.number().min(1).max(5);
	constructor(public readonly value: number) {}
	public static create(value: number) {
		return new TimelineDay(this.schema.parse(value));
	}
}

export class TimelinePeriod {
	private static readonly schema = z.number().min(1).max(3);
	constructor(public readonly value: number) {}
	public static create(value: number) {
		return new TimelinePeriod(this.schema.parse(value));
	}
}
