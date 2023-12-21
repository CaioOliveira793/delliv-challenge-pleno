import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { ResourceAlreadyExists } from '@/exception/resource/ResourceAlreadyExists';
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
import { ResourceNotFound } from '@/exception/resource/ResourceNotFound';
import { ReqHeader } from '@/decorator/ReqHeader';
import { AuthTokenPipe } from '@/pipe/AuthTokenPipe';
import { SchemaPipe } from '@/pipe/SchemaPipe';

@Controller('user')
export class UserController {
	constructor(
		@Inject(PASSWORD_ENCRYPTION_PROVIDER)
		private readonly passwordEncryption: PasswordEncryptionService,
		@Inject(TOKEN_ENCRYPTION_PROVIDER)
		private readonly tokenEncryption: TokenEncryptionService,
		@Inject(USER_REPOSITORY_PROVIDER)
		private readonly userRepository: UserRepository
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	public async createUser(
		@Body(new SchemaPipe(CreateUserSchema)) data: CreateUserData
	): Promise<AuthResponse> {
		const existentUser = await this.userRepository.findByEmail(data.email);
		if (existentUser) {
			throw new ResourceAlreadyExists('Resource already exists', [
				{
					resource_type: 'USER',
					key: 'email:' + data.email,
					path: '.email',
				},
			]);
		}

		const user = await User.create(data, this.passwordEncryption);
		const token = await Token.new(user.id, this.tokenEncryption);

		await this.userRepository.insert(user);

		return { token: token.toString(), user: makeUserResource(user) };
	}

	@Get('me')
	@HttpCode(HttpStatus.OK)
	public async getLoggedUser(
		@ReqHeader('authentication', AuthTokenPipe) token: Token<string>
	): Promise<UserResource> {
		const user = await this.userRepository.find(token.data);
		if (!user) {
			throw new ResourceNotFound('Resource not found', [
				{
					resource_type: 'USER',
					key: 'id:' + token.data,
					path: null,
				},
			]);
		}

		return makeUserResource(user);
	}
}
