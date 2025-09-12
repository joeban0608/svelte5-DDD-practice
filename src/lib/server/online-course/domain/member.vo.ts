import z from 'zod';

export class MemberId {
	private static readonly schema = z.string().uuid();
	public constructor(public readonly value: string) {}
	public static create(value: string): MemberId {
		return new MemberId(this.schema.parse(value));
	}
}

const memberRoleSchema = z.enum(['student', 'teacher', 'admin']);
type MemberRoleType = z.infer<typeof memberRoleSchema>;
export class MemberRole {
	private static readonly schema = memberRoleSchema;
	public constructor(public readonly value: MemberRoleType) {}
	public static create(value: MemberRoleType): MemberRole {
		return new MemberRole(this.schema.parse(value));
	}
}
