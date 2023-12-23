import { Inject, Injectable } from '@nestjs/common';
import { ConflictError } from '@/exception/resource/ConflictError';
import { CreateUserData, User } from '@/module/iam/entity/User';
import { Token } from '@/module/iam/type/Token';
import { AuthResponse, USER_RESOURCE, makeUserResource } from '@/module/iam/dto/Resource';
import {
	PASSWORD_ENCRYPTION_PROVIDER,
	PasswordEncryptionService,
	TOKEN_ENCRYPTION_PROVIDER,
	TokenEncryptionService,
} from '@/module/iam/service/EncryptionService';
import { USER_REPOSITORY_PROVIDER, UserRepository } from '@/module/iam/service/UserRepository';

@Injectable()
export class CreateUserService {
	constructor(
		@Inject(PASSWORD_ENCRYPTION_PROVIDER)
		private readonly passwordEncryption: PasswordEncryptionService,
		@Inject(TOKEN_ENCRYPTION_PROVIDER)
		private readonly tokenEncryption: TokenEncryptionService,
		@Inject(USER_REPOSITORY_PROVIDER)
		private readonly userRepository: UserRepository
	) {}

	public async execute(data: CreateUserData): Promise<AuthResponse> {
		const existentUser = await this.userRepository.findByEmail(data.email);
		if (existentUser) {
			throw new ConflictError({
				resource_type: USER_RESOURCE,
				key: 'email:' + data.email,
				path: '.email',
			});
		}

		const user = await User.create(data, this.passwordEncryption);
		const token = await Token.new(user.id, this.tokenEncryption);

		await this.userRepository.insert(user);

		return { token: token.toString(), user: makeUserResource(user) };
	}
}
