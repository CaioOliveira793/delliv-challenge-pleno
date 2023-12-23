import { ulid } from 'ulid';
import { Entity, EntityID } from '@/module/base/Entity';
import { PasswordEncryptionService } from '@/module/iam/service/EncryptionService';
import { UnauthorizedError, UnauthorizedType } from '@/exception/security/UnauthorizedError';

export interface UserState {
	created: Date;
	updated: Date;
	name: string;
	email: string;
	passwordHash: string;
	lastAuth: Date;
}

export interface CreateUserData {
	name: string;
	email: string;
	password: string;
}

export class User extends Entity<UserState> {
	public static async create(
		data: CreateUserData,
		encryptionService: PasswordEncryptionService
	): Promise<User> {
		const passwordHash = await encryptionService.hash(data.password);
		const now = new Date();

		return new User(ulid(), {
			name: data.name,
			email: data.email,
			passwordHash,
			lastAuth: now,
			created: now,
			updated: now,
		});
	}

	public static restore(id: EntityID, state: UserState): User {
		return new User(id, state);
	}

	public async makeAuthentication(
		password: string,
		passwordService: PasswordEncryptionService
	): Promise<void> {
		const match = await passwordService.compare(this.state.passwordHash, password);
		if (!match) {
			throw new UnauthorizedError(UnauthorizedType.InvalidCredential);
		}

		this.state.lastAuth = new Date();
	}

	public get name() {
		return this.state.name;
	}
	public get email() {
		return this.state.email;
	}
	public get passwordHash() {
		return this.state.passwordHash;
	}
	public get lastAuth() {
		return this.state.lastAuth;
	}
	public get created() {
		return this.state.created;
	}
	public get updated() {
		return this.state.updated;
	}
}
