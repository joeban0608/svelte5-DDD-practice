import { CreatedAt, UpdatedAt } from '$lib/server/_share/domain/share.vo';
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

	public static async create(
		props: Omit<UserProps, 'id' | 'createdAt' | 'updatedAt' | 'hashedPassword'> & {
			plainPassword: string;
		}
	): Promise<UserAggregate> {
		const now = Date.now();
		const hashed = await this.hashPassword(props.plainPassword);
		return new UserAggregate({
			...props,
			id: UserId.create(crypto.randomUUID()),
			hashedPassword: UserHashedPassword.create(hashed),
			createdAt: CreatedAt.create(now),
			updatedAt: UpdatedAt.create(now)
		});
	}

	public static from(primitive: UserProps): UserAggregate {
		return new UserAggregate(primitive);
	}

	private static async hashPassword(plainPassword: string): Promise<string> {
		const encoder = new TextEncoder();
		const data = encoder.encode(plainPassword);
		const hashBuffer = await crypto.subtle.digest('SHA-256', data);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		// 轉成 hex 字串
		return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
	}
	private static async verifyPassword(plainPassword: string, hashed: string): Promise<boolean> {
		const hashToCompare = await this.hashPassword(plainPassword);
		return hashed === hashToCompare;
	}
	// 更新使用者密碼
	public async updatedPassword({
		oldPassword,
		newPassword
	}: {
		oldPassword: string;
		newPassword: string;
	}) {
		if (!oldPassword || !newPassword) {
			throw new Error('Old password and new password are required');
		}

		const isOldPasswordValid = await UserAggregate.verifyPassword(
			oldPassword,
			this.hashedPassword.value
		);
		if (!isOldPasswordValid) {
			throw new Error('Old password is incorrect');
		}
		const newHashedPassword = await UserAggregate.hashPassword(newPassword);
		this._hashedPassword = UserHashedPassword.create(newHashedPassword);
		this._updatedAt = UpdatedAt.create(Date.now());
	}

	// 授予 permission
	public addPermission(permission: UserPermission) {
		if (!this._permissions.some((p) => p.value === permission.value)) {
			this._permissions.push(permission);
			this._updatedAt = UpdatedAt.create(Date.now());
		}
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

	// 移除權限
	public removePermission(permission: UserPermission) {
		this._permissions = this._permissions.filter((p) => p.value !== permission.value);
		this._updatedAt = UpdatedAt.create(Date.now());
	}
}
