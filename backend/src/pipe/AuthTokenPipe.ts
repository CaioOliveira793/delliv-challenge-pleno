import { PipeTransform, Injectable } from '@nestjs/common';
import { Token } from '@/module/iam/type/Token';
import { AuthService } from '@/module/iam/service/AuthService';

@Injectable()
export class AuthTokenPipe implements PipeTransform {
	constructor(private readonly authService: AuthService) {}

	public async transform(authenticationHeader: unknown): Promise<Token<string>> {
		return this.authService.bearerAuthScheme(authenticationHeader);
	}
}
