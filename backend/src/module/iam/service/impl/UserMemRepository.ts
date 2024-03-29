import { Injectable, Optional, Provider } from '@nestjs/common';
import { uniqueConstraintViolationMessage } from '@/exception/Message';
import { User, UserState } from '@/module/iam/entity/User';
import { USER_REPOSITORY_PROVIDER, UserRepository } from '@/module/iam/service/UserRepository';
import { ResourceNotFound } from '@/exception/resource/ResourceNotFound';
import { USER_RESOURCE } from '@/module/iam/dto/Resource';

@Injectable()
export class UserMemRepository implements UserRepository {
	protected readonly users: Map<string, UserState>;

	public constructor(@Optional() users: Map<string, UserState> = new Map()) {
		this.users = users;
	}

	public async insert(user: User): Promise<void> {
		if (this.users.get(user.id)) {
			throw new Error(UserMemRepository.UNIQUE_ID_MESSAGE);
		}
		if (this.idFromEmail(user.email)) {
			throw new Error(UserMemRepository.UNIQUE_EMAIL_MESSAGE);
		}

		this.users.set(user.id, user.internalState());
	}

	public async find(id: string): Promise<User | null> {
		const state = this.users.get(id);
		if (state) {
			return User.restore(id, structuredClone(state));
		}
		return null;
	}

	public async findByEmail(email: string): Promise<User | null> {
		for (const [id, state] of this.users.entries()) {
			if (state.email === email) {
				return User.restore(id, structuredClone(state));
			}
		}
		return null;
	}

	public async update(user: User): Promise<void> {
		const idWithSameEmail = this.idFromEmail(user.email);
		if (idWithSameEmail && idWithSameEmail !== user.id) {
			throw new Error(UserMemRepository.UNIQUE_EMAIL_MESSAGE);
		}

		const state = this.users.get(user.id);
		if (!state) {
			throw new ResourceNotFound({
				key: 'id:' + user.id,
				path: null,
				resource_type: USER_RESOURCE,
			});
		}

		this.users.set(user.id, user.internalState());
	}

	/**
	 * Update user last authentication field.
	 */
	public async updateLastAuth(id: string, lastAuth: Date): Promise<void> {
		const state = this.users.get(id);

		if (!state) {
			throw new ResourceNotFound({
				key: 'id:' + id,
				path: null,
				resource_type: USER_RESOURCE,
			});
		}

		state.lastAuth = lastAuth;
	}

	private idFromEmail(email: string): string | null {
		for (const [id, state] of this.users.entries()) {
			if (state.email === email) return id;
		}
		return null;
	}

	public static readonly UNIQUE_EMAIL_MESSAGE =
		uniqueConstraintViolationMessage('user_unique_email');
	public static readonly UNIQUE_ID_MESSAGE = uniqueConstraintViolationMessage('user_unique_id');
}

export const UserMemRepositoryProvider: Provider<UserRepository> = {
	provide: USER_REPOSITORY_PROVIDER,
	useClass: UserMemRepository,
};
