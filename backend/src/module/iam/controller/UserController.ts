import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserData } from '@/module/iam/entity/User';
import { AuthResponse, UserResource, makeUserResource } from '@/module/iam/dto/Resource';
import { Token } from '@/module/iam/type/Token';
import { CreateUserSchema } from '@/module/iam/validation/Schema';
import { ReqHeader } from '@/decorator/ReqHeader';
import { AccessTokenPipe } from '@/pipe/AccessTokenPipe';
import { SchemaPipe } from '@/pipe/SchemaPipe';
import { AuthService } from '@/module/iam/service/AuthService';
import { CreateUserService } from '@/module/iam/usecase/CreateUserService';

@Controller('user')
export class UserController {
	constructor(
		private readonly authService: AuthService,
		private readonly createUserService: CreateUserService
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	public async createUser(
		@Body(new SchemaPipe(CreateUserSchema)) data: CreateUserData
	): Promise<AuthResponse> {
		return this.createUserService.execute(data);
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
