import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { CreateUserData, User } from '@/module/iam/entity/User';
import {
	PASSWORD_ENCRYPTION_PROVIDER,
	PasswordEncryptionService,
	TOKEN_ENCRYPTION_PROVIDER,
	TokenEncryptionService,
} from '@/module/iam/service/EncryptionService';
import { AuthResponse, UserResource, makeUserResource } from '@/module/iam/dto/Resource';
import { USER_REPOSITORY_PROVIDER, UserRepository } from '@/module/iam/service/UserRepository';
import { Token } from '@/module/iam/type/Token';
import { CreateUserSchema } from '@/module/iam/validation/Schema';
import { ReqHeader } from '@/decorator/ReqHeader';
import { AccessTokenPipe } from '@/pipe/AccessTokenPipe';
import { SchemaPipe } from '@/pipe/SchemaPipe';
import { AuthService } from '../service/AuthService';
import { ConflictError } from '@/exception/resource/ConflictError';

@Controller('user')
export class UserController {
	constructor(
		@Inject(PASSWORD_ENCRYPTION_PROVIDER)
		private readonly passwordEncryption: PasswordEncryptionService,
		@Inject(TOKEN_ENCRYPTION_PROVIDER)
		private readonly tokenEncryption: TokenEncryptionService,
		@Inject(USER_REPOSITORY_PROVIDER)
		private readonly userRepository: UserRepository,
		private readonly authService: AuthService
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	public async createUser(
		@Body(new SchemaPipe(CreateUserSchema)) data: CreateUserData
	): Promise<AuthResponse> {
		const existentUser = await this.userRepository.findByEmail(data.email);
		if (existentUser) {
			throw new ConflictError({
				resource_type: 'USER',
				key: 'email:' + data.email,
				path: '.email',
			});
		}

		const user = await User.create(data, this.passwordEncryption);
		const token = await Token.new(user.id, this.tokenEncryption);

		await this.userRepository.insert(user);

		return { token: token.toString(), user: makeUserResource(user) };
	}

	// TODO: add route to update the user

	@Get('me')
	@HttpCode(HttpStatus.OK)
	public async getLoggedUser(
		@ReqHeader('authorization', AccessTokenPipe) token: Token<string>
	): Promise<UserResource> {
		const user = await this.authService.getAuthenticatedUser(token);
		return makeUserResource(user);
	}
}
