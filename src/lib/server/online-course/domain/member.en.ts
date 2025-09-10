import { UserId } from '$lib/server/user-system/domain/user.vo';
import { MemberId, MemberPermission } from './member.vo';

export type MemberProps = {
	id: MemberId;
	userId: UserId;
	role: MemberPermission;
};

export class MemberEntity {
	public readonly id: MemberId;
	public readonly userId: UserId;
	public readonly role: MemberPermission;

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
