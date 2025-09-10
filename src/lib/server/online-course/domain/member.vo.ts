import z from 'zod';

export class MemberId {
	private static readonly schema = z.string().uuid();
	public constructor(public readonly value: string) {}
	public static create(value: string): MemberId {
		return new MemberId(this.schema.parse(value));
	}
}

const memberPermissionSchema = z.enum(['student', 'teacher', 'admin']);
type MemberPermissionType = z.infer<typeof memberPermissionSchema>;
export class MemberPermission {
	private static readonly schema = memberPermissionSchema;
	public constructor(public readonly value: MemberPermissionType) {}
	public static create(value: MemberPermissionType): MemberPermission {
		return new MemberPermission(this.schema.parse(value));
	}
}
