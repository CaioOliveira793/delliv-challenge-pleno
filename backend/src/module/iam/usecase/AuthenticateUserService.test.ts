import { USER_RESOURCE, UserCredential } from '@/module/iam/dto/Resource';
import { fakeCreateUserData, fakeUserCredential } from '@/module/iam/entity/User.fake';
import { Argon2EncryptionService } from '@/module/iam/service/impl/Argon2EncryprionService';
import { JWTEncryptionService } from '@/module/iam/service/impl/JWTEncryptionService';
import { UserMemRepository } from '@/module/iam/service/impl/UserMemRepository';
import { AuthenticateUserService } from '@/module/iam/usecase/AuthenticateUserService';
import { User } from '@/module/iam/entity/User';
import { UlidSchema } from '@/validation/Schema';
import { ResourceNotFound } from '@/exception/resource/ResourceNotFound';
import { UnauthorizedError, UnauthorizedType } from '@/exception/security/UnauthorizedError';

const argon2Encryption = new Argon2EncryptionService();
const jwtEncryption = new JWTEncryptionService('super-private-secret');

describe('AuthenticateUserService', () => {
	it('authenticate the user updating the "last_authentication" field and returning a valid token', async () => {
		const userRepository = new UserMemRepository();
		const service = new AuthenticateUserService(argon2Encryption, jwtEncryption, userRepository);
		const password = '73#kS5&H1b^';
		const user = await User.create(fakeCreateUserData({ password }), argon2Encryption);
		await userRepository.insert(user);
		const credential: UserCredential = { email: user.email, password };

		const preAuthTime = new Date();

		const { token, user: authUser } = await service.execute(credential);

		expect(authUser.email).toStrictEqual(user.email);
		expect(authUser.id).toStrictEqual(user.id);
		expect(authUser.last_authentication.getTime()).toBeGreaterThanOrEqual(preAuthTime.getTime());

		expect(await jwtEncryption.verify(token.toString(), UlidSchema)).toStrictEqual(user.id);
	});

	it('throw a ResourceNotFound error when authenticating the user that is not present in the repository', async () => {
		const userRepository = new UserMemRepository();
		const service = new AuthenticateUserService(argon2Encryption, jwtEncryption, userRepository);
		const credential = fakeUserCredential();

		await expect(() => service.execute(credential)).rejects.toThrow(
			new ResourceNotFound({
				resource_type: USER_RESOURCE,
				key: 'email:' + credential.email,
				path: '.email',
			})
		);
	});

	it('throw a UnauthorizedError error when authenticating a user with a invalid password', async () => {
		const userRepository = new UserMemRepository();
		const service = new AuthenticateUserService(argon2Encryption, jwtEncryption, userRepository);
		const user = await User.create(
			fakeCreateUserData({ password: '73#kS5&H1b^' }),
			argon2Encryption
		);
		await userRepository.insert(user);
		const credential: UserCredential = { email: user.email, password: 'wrong-password' };

		await expect(service.execute(credential)).rejects.toThrow(
			new UnauthorizedError(UnauthorizedType.InvalidCredential)
		);
	});
});
