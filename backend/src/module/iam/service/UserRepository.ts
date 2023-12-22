import { uniqueConstraintViolationMessage } from '@/exception/Message';
import { ResourceNotFound } from '@/exception/resource/ResourceNotFound';
import { EntityID } from '@/module/base/Entity';
import { User, UserState } from '@/module/iam/entity/User';
import { Injectable, Provider, Optional } from '@nestjs/common';

export interface UserRepository {
	insert(user: User): Promise<void>;
	find(id: EntityID): Promise<User | null>;
	findByEmail(email: string): Promise<User | null>;
	update(user: User): Promise<void>;
	updateLastAuth(id: string, lastAuth: Date): Promise<void>;
}

export const USER_REPOSITORY_PROVIDER = 'IAM/USER_REPOSITORY_PROVIDER';

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
		if (this.idFromEmail(user.email) !== user.id) {
			throw new Error(UserMemRepository.UNIQUE_EMAIL_MESSAGE);
		}

		const state = this.users.get(user.id);
		if (!state) {
			throw new ResourceNotFound('Resource not found', {
				key: 'id:' + user.id,
				path: null,
				resource_type: 'USER',
			});
		}

		this.users.set(user.id, user.internalState());
	}

	/**
	 * Update user last authentication time.
	 */
	public async updateLastAuth(id: string, lastAuth: Date): Promise<void> {
		const state = this.users.get(id);

		if (!state) {
			throw new ResourceNotFound('Resource not found', {
				key: 'id:' + id,
				path: null,
				resource_type: 'USER',
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

	private static readonly UNIQUE_EMAIL_MESSAGE = uniqueConstraintViolationMessage('unique_email');
	private static readonly UNIQUE_ID_MESSAGE = uniqueConstraintViolationMessage('unique_id');
}

export const UserRepositoryProvider: Provider<UserRepository> = {
	provide: USER_REPOSITORY_PROVIDER,
	useClass: UserMemRepository,
};
