import { CreatedAt, UpdatedAt } from '$lib/server/_share/share.vo';
import { UserId, UserEmail, UserHashedPassword, UserName, UserPermission } from './user.vo';

export type UserProps = {
	id: UserId;
	name: UserName;
	email: UserEmail;
	hashedPassword: UserHashedPassword;
	createdAt: CreatedAt;
	updatedAt: UpdatedAt;
	permissions: UserPermission[];
};

export class UserAggregate {
	public readonly id: UserId;
	public readonly createdAt: CreatedAt;

	private _email: UserEmail;
	private _hashedPassword: UserHashedPassword;
	private _name: UserName;
	public _updatedAt: UpdatedAt;
	private _permissions: UserPermission[];

	public get email() {
		return this._email;
	}
	public get hashedPassword() {
		return this._hashedPassword;
	}
	public get name() {
		return this._name;
	}

	public get updatedAt() {
		return this._updatedAt;
	}

	public get permissions() {
		return this._permissions;
	}

	private constructor(props: UserProps) {
		this.id = props.id;
		this.createdAt = props.createdAt;

		this._email = props.email;
		this._hashedPassword = props.hashedPassword;
		this._name = props.name;
		this._updatedAt = props.updatedAt;
		this._permissions = props.permissions;
	}

	private static hashPassword(plainPwd: string): string {
		return crypto.createHash('sha256').update(plain).digest('hex');
	}

	public static create(
		props: Omit<
			UserProps & { plainPwd: string },
			'id' | 'hashedPassword' | 'createdAt' | 'updatedAt' | 'permissions'
		>
	): UserAggregate {
		const now = Date.now();
		const hashed = this.hashPassword(plainPwd);
		return new UserAggregate({
			...props,
			id: UserId.create(crypto.randomUUID()),
			hashedPassword: UserHashedPassword.create(hashed),
			createdAt: CreatedAt.create(now),
			updatedAt: UpdatedAt.create(now),
			permissions: [] // default permission
		});
	}

	public static from(primitive: UserProps): UserAggregate {
		return new UserAggregate(primitive);
	}

	// 新增權限（如 course:student）
	public addPermission(permission: UserPermission) {
		if (!this._permissions.some((p) => p.value === permission.value)) {
			this._permissions.push(permission);
			this._updatedAt = UpdatedAt.create(Date.now());
		}
	}

	// 移除權限
	public removePermission(permission: UserPermission) {
		this._permissions = this._permissions.filter((p) => p.value !== permission.value);
		this._updatedAt = UpdatedAt.create(Date.now());
	}

	// 更新使用者名稱
	public updateName(name: UserName) {
		this._name = name;
		this._updatedAt = UpdatedAt.create(Date.now());
	}

	// 更新使用者 Email
	public updateEmail(email: UserEmail) {
		this._email = email;
		this._updatedAt = UpdatedAt.create(Date.now());
	}

	// 更新使用者密碼

	public updatePassword(plainPwd: string) {
		const hashed = UserAggregate.hashPassword(plainPwd);
		this._hashedPassword = UserHashedPassword.create(hashed);
		this._updatedAt = UpdatedAt.create(Date.now());
	}
}
