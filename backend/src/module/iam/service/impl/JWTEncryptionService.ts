import { Schema } from 'zod';
import { Injectable, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from '@/config/Environment';
import { UnauthorizedError, UnauthorizedType } from '@/exception/security/UnauthorizedError';
import { JWTService } from '@/module/iam/service/JWTService';
import {
	TOKEN_ENCRYPTION_PROVIDER,
	TokenEncryptionService,
} from '@/module/iam/service/EncryptionService';

@Injectable()
export class JWTEncryptionService implements TokenEncryptionService {
	public constructor(secret: string) {
		this.jwtService = new JWTService(secret);
	}

	public async verify<T>(cypher: string, schema: Schema<T>): Promise<T> {
		try {
			const payload = await this.jwtService.verify<T>(cypher);
			const result = schema.safeParse(payload.data);

			if (!result.success) {
				throw new UnauthorizedError(UnauthorizedType.InvalidToken);
			}

			return result.data;
		} catch (err) {
			throw new UnauthorizedError(UnauthorizedType.InvalidToken);
		}
	}

	public async sign<T>(data: T): Promise<string> {
		return this.jwtService.sign<T>(data, JWTEncryptionService.TOKEN_EXPIRATION + Date.now());
	}

	private static readonly TOKEN_EXPIRATION = 60 * 60 * 8; // 8h
	private readonly jwtService: JWTService;
}

function jwtEncryptionServiceFactory(
	config: ConfigService<EnvVariables, true>
): JWTEncryptionService {
	return new JWTEncryptionService(config.get<string>('TOKEN_SECRET'));
}

export const JWTEncryptionProvider: Provider<TokenEncryptionService> = {
	provide: TOKEN_ENCRYPTION_PROVIDER,
	useFactory: jwtEncryptionServiceFactory,
	inject: [ConfigService],
};
