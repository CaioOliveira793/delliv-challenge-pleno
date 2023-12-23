import { UlidSchema } from '@/validation/Schema';
import { fakeCreateUserData, fakeUser } from '@/module/iam/entity/User.fake';
import { Argon2EncryptionService } from '@/module/iam/service/impl/Argon2EncryprionService';
import { JWTEncryptionService } from '@/module/iam/service/impl/JWTEncryptionService';
import { UserMemRepository } from '@/module/iam/service/impl/UserMemRepository';
import { CreateUserService } from '@/module/iam/usecase/CreateUserService';
import { ConflictError } from '@/exception/resource/ConflictError';
import { USER_RESOURCE } from '@/module/iam/dto/Resource';

const argon2Encryption = new Argon2EncryptionService();
const jwtEncryption = new JWTEncryptionService('super-private-secret');

describe('CreateUserService', () => {
	it('create a new user returning the user resource and a valid access token', async () => {
		const userRepository = new UserMemRepository();
		const service = new CreateUserService(argon2Encryption, jwtEncryption, userRepository);
		const data = fakeCreateUserData();

		const { token, user } = await service.execute(data);

		expect(user.email).toStrictEqual(data.email);
		expect(user.name).toStrictEqual(data.name);
		expect(user.updated).toStrictEqual(user.created);
		expect(user.last_authentication).toStrictEqual(user.created);

		const writtenUser = await userRepository.find(user.id);
		expect(writtenUser).not.toStrictEqual(null);

		expect(await jwtEncryption.verify(token.toString(), UlidSchema)).toStrictEqual(user.id);
	});

	it('throw a conflict error when creating a user with an email already in the repository', async () => {
		const userRepository = new UserMemRepository();
		const service = new CreateUserService(argon2Encryption, jwtEncryption, userRepository);
		const user = fakeUser();
		await userRepository.insert(user);
		const data = fakeCreateUserData({ email: user.email });

		await expect(() => service.execute(data)).rejects.toThrow(
			new ConflictError({
				resource_type: USER_RESOURCE,
				key: 'email:' + data.email,
				path: '.email',
			})
		);
	});
});
