import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ReqCredential } from '@/decorator/ReqCredential';
import { AuthResponse, UserCredential } from '@/module/iam/dto/Resource';
import { AuthenticateUserService } from '@/module/iam/usecase/AuthenticateUserService';

@Controller('auth')
export class AuthController {
	constructor(private readonly authenticateUserService: AuthenticateUserService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	async authenticate(@ReqCredential() credential: UserCredential): Promise<AuthResponse | void> {
		return this.authenticateUserService.execute(credential);
	}
}
