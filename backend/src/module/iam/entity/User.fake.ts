import { ulid } from 'ulid';
import { faker } from '@faker-js/faker';
import { User, UserState } from '@/module/iam/entity/User';

export function fakeUserState(state: Partial<UserState> = {}): UserState {
	const created = state.created ?? faker.date.past();
	return {
		created: state.created ?? faker.date.past(),
		updated: state.updated ?? faker.date.between({ from: created, to: new Date() }),
		email: state.email ?? faker.internet.email(),
		name: state.name ?? faker.person.fullName(),
		lastAuth: state.lastAuth ?? faker.date.between({ from: created, to: new Date() }),
		passwordHash: state.passwordHash ?? faker.string.sample(32),
	};
}

export function fakeUser(state: Partial<UserState> = {}, id = ulid()): User {
	return User.restore(id, fakeUserState(state));
}
