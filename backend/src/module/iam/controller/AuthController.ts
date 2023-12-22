import { Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { ResourceNotFound } from '@/exception/resource/ResourceNotFound';
import {
	PASSWORD_ENCRYPTION_PROVIDER,
	PasswordEncryptionService,
	TOKEN_ENCRYPTION_PROVIDER,
	TokenEncryptionService,
} from '@/module/iam/service/EncryptionService';
import { USER_REPOSITORY_PROVIDER, UserRepository } from '@/module/iam/service/UserRepository';
import { Token } from '@/module/iam/type/Token';
import { AuthResponse, UserCredential, makeUserResource } from '@/module/iam/dto/Resource';
import { ReqCredential } from '@/decorator/ReqCredential';

@Controller('auth')
export class AuthController {
	constructor(
		@Inject(PASSWORD_ENCRYPTION_PROVIDER)
		private readonly passwordEncryption: PasswordEncryptionService,
		@Inject(TOKEN_ENCRYPTION_PROVIDER)
		private readonly tokenEncryption: TokenEncryptionService,
		@Inject(USER_REPOSITORY_PROVIDER)
		private readonly userRepository: UserRepository
	) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	async authenticate(@ReqCredential() credential: UserCredential): Promise<AuthResponse | void> {
		const user = await this.userRepository.findByEmail(credential.email);
		if (!user) {
			throw new ResourceNotFound('Resource not found', {
				resource_type: 'USER',
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
