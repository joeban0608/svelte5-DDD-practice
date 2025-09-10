import z from 'zod';

export class UserId {
	private static readonly schema = z.string().uuid();
	public constructor(public readonly value: string) {}
	public static create(value: string): UserId {
		return new UserId(this.schema.parse(value));
	}
}

export class UserName {
	private static readonly schema = z.string().min(1).max(50);
	public constructor(public readonly value: string) {}
	public static create(value: string): UserName {
		return new UserName(this.schema.parse(value));
	}
}

export class UserEmail {
	private static readonly schema = z.string().email();
	public constructor(public readonly value: string) {}
	public static create(value: string): UserEmail {
		return new UserEmail(this.schema.parse(value));
	}
}

export class UserHashedPassword {
	private static readonly schema = z.string().min(60).max(60);
	public constructor(public readonly value: string) {}
	public static create(value: string): UserHashedPassword {
		return new UserHashedPassword(this.schema.parse(value));
	}
}

export class UserPermission {
	private static readonly schema = z.string();
	public constructor(public readonly value: string) {}
	public static create(value: string): UserPermission {
		return new UserPermission(this.schema.parse(value));
	}
}
