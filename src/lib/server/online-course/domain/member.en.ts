import { UserId } from '$lib/server/user-system/domain/user.vo';
import { MemberId, MemberRole,  } from './member.vo';

export type MemberProps = {
	id: MemberId;
	userId: UserId;
	role: MemberRole;
};

export class MemberEntity {
	public readonly id: MemberId;
	public readonly userId: UserId;
	public readonly role: MemberRole;

	private constructor(props: MemberProps) {
		this.id = props.id;
		this.userId = props.userId;
		this.role = props.role;
	}

	public static create(props: Omit<MemberProps, 'id'>): MemberEntity {
		return new MemberEntity({
			...props,
			id: MemberId.create(crypto.randomUUID())
		});
	}
}
