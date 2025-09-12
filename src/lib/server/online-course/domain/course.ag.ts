import { CreatedAt, UpdatedAt } from '$lib/server/_share/domain/share.vo';
import type { UserId } from '$lib/server/user-system/domain/user.vo';
import type { MemberRoleType } from '../infrastructure/course.ad';
import { CourseId, CourseName, CourseDescription, CourseStudentCountRange } from './course.vo';
import { MemberEntity } from './member.en';
import { MemberRole } from './member.vo';

export type CourseProps = {
	id: CourseId;
	name: CourseName;
	description: CourseDescription;
	studentCountRange: CourseStudentCountRange;
	createdAt: CreatedAt;
	updatedAt: UpdatedAt;
};

export class CourseAggregate {
	public readonly id: CourseId;
	public readonly createdAt: CreatedAt;

	private _description: CourseDescription;
	private _name: CourseName;
	private _studentCountRange: CourseStudentCountRange;
	private _updatedAt: UpdatedAt;

	private _members: MemberEntity[];
	private _studentCount: number;

	public get description() {
		return this._description;
	}
	public get name() {
		return this._name;
	}
	public get studentCountRange() {
		return this._studentCountRange;
	}
	public get updatedAt() {
		return this._updatedAt;
	}

	public get members() {
		return this._members;
	}

	public get studentCount() {
		return this._studentCount;
	}

	private constructor(props: CourseProps, members: MemberEntity[]) {
		this.id = props.id;
		this.createdAt = props.createdAt;

		this._name = props.name;
		this._description = props.description;
		this._studentCountRange = props.studentCountRange;
		this._updatedAt = props.updatedAt;

		this._members = members;
		this._studentCount = this._members.filter((m) => m.role.value === 'student').length; // 初始化時計算一次
	}

	public static create(
		props: Omit<CourseProps, 'id' | 'createdAt' | 'updatedAt'>
	): CourseAggregate {
		const now = Date.now();
		return new CourseAggregate(
			{
				...props,
				id: CourseId.create(crypto.randomUUID()),
				createdAt: CreatedAt.create(now),
				updatedAt: UpdatedAt.create(now)
			},
			[]
		);
	}

	public static from(primitive: CourseProps, members: MemberEntity[]): CourseAggregate {
		return new CourseAggregate(primitive, members);
	}

	public async addMember({
		userId,
		roles
	}: {
		userId: UserId;
		roles: MemberRoleType[];
	}): Promise<{ memberId: string }> {
		if (roles.length !== 1) {
			throw new Error('course member must have exactly one role');
		}
		if (this.studentCount >= this._studentCountRange.value.max) {
			throw new Error('course has reached maximum student count');
		}
		if (this._members.find((m) => m.userId.value === userId.value)) {
			throw new Error('user is already a member of the course');
		}
		const member = MemberEntity.create({ userId, role: MemberRole.create(roles[0]) });
		this._members.push(member);
		this._updatedAt = UpdatedAt.create(Date.now());

		// 新增學生要同步加
		if (roles[0] === 'student') {
			this._studentCount++;
		}

		return {
			memberId: member.id.value
		};
	}

	public removeMember(member: MemberEntity) {
		this._members = this._members.filter((m) => m !== member);
		this._updatedAt = UpdatedAt.create(Date.now());
	}

	public changeName(name: CourseName) {
		this._name = name;
		this._updatedAt = UpdatedAt.create(Date.now());
	}

	public changeDescription(description: CourseDescription) {
		this._description = description;
		this._updatedAt = UpdatedAt.create(Date.now());
	}

	public changeStudentCountRange(range: CourseStudentCountRange) {
		this._studentCountRange = range;
		this._updatedAt = UpdatedAt.create(Date.now());
	}
}
