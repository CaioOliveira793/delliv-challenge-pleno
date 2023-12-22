import { PipeTransform, Injectable, Inject } from '@nestjs/common';
import { tokenFromBearerAuthScheme } from '@/http/AuthenticationScheme';
import { UlidSchema } from '@/validation/Schema';
import { Token } from '@/module/iam/type/Token';
import {
	TOKEN_ENCRYPTION_PROVIDER,
	TokenEncryptionService,
} from '@/module/iam/service/EncryptionService';

@Injectable()
export class AccessTokenPipe implements PipeTransform {
	constructor(
		@Inject(TOKEN_ENCRYPTION_PROVIDER)
		private readonly tokenEncryption: TokenEncryptionService
	) {}

	public async transform(authenticationHeader: unknown): Promise<Token<string>> {
		const tokenStr = tokenFromBearerAuthScheme(authenticationHeader);
		return Token.verify(tokenStr, this.tokenEncryption, UlidSchema);
	}
}
