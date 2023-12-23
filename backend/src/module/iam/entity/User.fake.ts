import { ulid } from 'ulid';
import { faker } from '@faker-js/faker';
import { CreateUserData, User, UserState } from '@/module/iam/entity/User';
import { UserCredential } from '../dto/Resource';

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

export function fakeUserPassword(): string {
	return faker.string.alphanumeric({ length: { min: 8, max: 12 }, casing: 'mixed' });
}

export function fakeCreateUserData(data: Partial<CreateUserData> = {}): CreateUserData {
	return {
		email: data.email ?? faker.internet.email(),
		name: data.name ?? faker.person.fullName(),
		password: data.password ?? fakeUserPassword(),
	};
}

export function fakeUserCredential(data: Partial<UserCredential> = {}): UserCredential {
	return {
		email: data.email ?? faker.internet.email(),
		password: data.password ?? fakeUserPassword(),
	};
}
