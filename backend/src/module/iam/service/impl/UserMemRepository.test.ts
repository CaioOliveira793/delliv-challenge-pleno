import { ulid } from 'ulid';
import { faker } from '@faker-js/faker';
import { UserMemRepository } from '@/module/iam/service/impl/UserMemRepository';
import { fakeUser } from '@/module/iam/entity/User.fake';
import { ResourceNotFound } from '@/exception/resource/ResourceNotFound';

describe('UserMemRepository', () => {
	it('insert a new user into the repository', async () => {
		const repository = new UserMemRepository();

		const user = fakeUser();
		await repository.insert(user);

		const savedUser = await repository.find(user.id);

		expect(savedUser).not.toStrictEqual(null);
		expect(savedUser!.internalState()).toStrictEqual(user.internalState());
	});

	it('throws an error when insert a user with a id already in the repository', async () => {
		const commonID = ulid();
		const repository = new UserMemRepository();

		await repository.insert(fakeUser({}, commonID));

		expect(() => repository.insert(fakeUser({}, commonID))).rejects.toThrow(
			new Error(UserMemRepository.UNIQUE_ID_MESSAGE)
		);
	});

	it('throws an error when insert a user with a email already in the repository', async () => {
		const commonEmail = faker.internet.email();
		const repository = new UserMemRepository();

		await repository.insert(fakeUser({ email: commonEmail }));

		expect(() => repository.insert(fakeUser({ email: commonEmail }))).rejects.toThrow(
			new Error(UserMemRepository.UNIQUE_EMAIL_MESSAGE)
		);
	});

	it('find a user by the id in the repository', async () => {
		const user = fakeUser();
		const repository = new UserMemRepository();

		await repository.insert(user);
		const userFound = await repository.find(user.id);

		expect(userFound).not.toStrictEqual(null);
		expect(userFound!.id).toStrictEqual(user.id);
		expect(userFound!.internalState()).toStrictEqual(user.internalState());
	});

	it('not find a user by the id when is not present in the repository', async () => {
		const user = fakeUser();
		const repository = new UserMemRepository();

		const userFound = await repository.find(user.id);

		expect(userFound).toStrictEqual(null);
	});

	it('find a user by the email in the repository', async () => {
		const user = fakeUser();
		const repository = new UserMemRepository();

		await repository.insert(user);
		const userFound = await repository.findByEmail(user.email);

		expect(userFound).not.toStrictEqual(null);
		expect(userFound!.id).toStrictEqual(user.id);
		expect(userFound!.internalState()).toStrictEqual(user.internalState());
	});

	it('not find a user by the email when is not present in the repository', async () => {
		const user = fakeUser();
		const repository = new UserMemRepository();

		const userFound = await repository.findByEmail(user.email);

		expect(userFound).toStrictEqual(null);
	});

	it('update a user in the repository', async () => {
		const user = fakeUser();
		const repository = new UserMemRepository();

		await repository.insert(user);

		user.update({ name: faker.person.fullName(), email: faker.internet.email() });
		await repository.update(user);

		const updatedUser = await repository.find(user.id);
		expect(updatedUser).not.toStrictEqual(null);
		expect(updatedUser!.internalState()).toStrictEqual(user.internalState());
	});

	it('throw an error updating a user with a email already present in the repository', async () => {
		const commonEmail = faker.internet.email();
		const user = fakeUser();
		const repository = new UserMemRepository();

		await repository.insert(fakeUser({ email: commonEmail }));
		await repository.insert(user);

		user.update({ name: faker.person.fullName(), email: commonEmail });

		expect(() => repository.update(user)).rejects.toThrow(
			new Error(UserMemRepository.UNIQUE_EMAIL_MESSAGE)
		);
	});

	it('throw an error updating a user when the user is not present in the repository', async () => {
		const user = fakeUser();
		const repository = new UserMemRepository();

		expect(() => repository.update(user)).rejects.toThrow(
			new ResourceNotFound({
				key: 'id:' + user.id,
				path: null,
				resource_type: 'USER',
			})
		);
	});

	it('update the user last authentication time in the repository', async () => {
		const user = fakeUser();
		const lastAuth = faker.date.between({ from: user.created, to: new Date() });
		const repository = new UserMemRepository();

		await repository.insert(user);
		await repository.updateLastAuth(user.id, lastAuth);

		const updatedUser = await repository.find(user.id);
		expect(updatedUser).not.toStrictEqual(null);
		expect(updatedUser!.lastAuth.toISOString()).toStrictEqual(lastAuth.toISOString());
	});

	it('throw an error updating the user last authentication time when the user is not present in the repository', async () => {
		const user = fakeUser();
		const lastAuth = faker.date.between({ from: user.created, to: new Date() });
		const repository = new UserMemRepository();

		expect(() => repository.updateLastAuth(user.id, lastAuth)).rejects.toThrow(
			new ResourceNotFound({
				key: 'id:' + user.id,
				path: null,
				resource_type: 'USER',
			})
		);
	});
});
