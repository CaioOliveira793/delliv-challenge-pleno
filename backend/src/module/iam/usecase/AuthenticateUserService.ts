import { Inject, Injectable } from '@nestjs/common';
import { ResourceNotFound } from '@/exception/resource/ResourceNotFound';
import { Token } from '@/module/iam/type/Token';
import {
	AuthResponse,
	USER_RESOURCE,
	UserCredential,
	makeUserResource,
} from '@/module/iam/dto/Resource';
import {
	PASSWORD_ENCRYPTION_PROVIDER,
	PasswordEncryptionService,
	TOKEN_ENCRYPTION_PROVIDER,
	TokenEncryptionService,
} from '@/module/iam/service/EncryptionService';
import { USER_REPOSITORY_PROVIDER, UserRepository } from '@/module/iam/service/UserRepository';

@Injectable()
export class AuthenticateUserService {
	constructor(
		@Inject(PASSWORD_ENCRYPTION_PROVIDER)
		private readonly passwordEncryption: PasswordEncryptionService,
		@Inject(TOKEN_ENCRYPTION_PROVIDER)
		private readonly tokenEncryption: TokenEncryptionService,
		@Inject(USER_REPOSITORY_PROVIDER)
		private readonly userRepository: UserRepository
	) {}

	public async execute(credential: UserCredential): Promise<AuthResponse> {
		const user = await this.userRepository.findByEmail(credential.email);
		if (!user) {
			throw new ResourceNotFound({
				resource_type: USER_RESOURCE,
				key: 'email:' + credential.email,
				path: '.email',
			});
		}

		await user.makeAuthentication(credential.password, this.passwordEncryption);
		await this.userRepository.updateLastAuth(user.id, user.lastAuth);

		const token = await Token.new(user.id, this.tokenEncryption);
		return { token: token.toString(), user: makeUserResource(user) };
	}
}
