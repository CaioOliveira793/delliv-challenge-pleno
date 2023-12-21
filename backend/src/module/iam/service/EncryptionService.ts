import { randomBytes } from 'node:crypto';
import { default as argon2 } from 'argon2';
import { Injectable, Provider } from '@nestjs/common';
import { UnauthorizedError, UnauthorizedType } from '@/exception/security/UnauthorizedError';
import { Schema } from 'zod';
import { JWTService } from './JWTService';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from '@/config/Environment';

export interface PasswordEncryptionService {
	hash(password: string): Promise<string>;
	compare(hash: string, password: string): Promise<boolean>;
}

export interface TokenEncryptionService {
	verify<T>(cypher: string, schema: Schema<T>): T | Promise<T>;
	sign<T>(data: T): string | Promise<string>;
}

export const PASSWORD_ENCRYPTION_PROVIDER = 'IAM/PASSWORD_ENCRYPTION_PROVIDER';
export const TOKEN_ENCRYPTION_PROVIDER = 'IAM/TOKEN_ENCRYPTION_PROVIDER';

const enum Argon2AlgorithmType {
	ARGON2D = 0,
	ARGON2I = 1,
	ARGON2ID = 2,
}

@Injectable()
export class Argon2EncryptionService implements PasswordEncryptionService {
	public async hash(plainText: string): Promise<string> {
		const salt = randomBytes(Argon2EncryptionService.SALT_LENGTH);
		return argon2.hash(plainText, {
			salt,
			saltLength: Argon2EncryptionService.SALT_LENGTH,
			hashLength: Argon2EncryptionService.HASH_LENGTH,
			memoryCost: Argon2EncryptionService.MEMORY_COST,
			timeCost: Argon2EncryptionService.TIME_COST,
			parallelism: Argon2EncryptionService.PARALLELISM,
			version: Argon2EncryptionService.ALGORITHM_VERSION,
			type: Argon2EncryptionService.TYPE,
		});
	}

	public async compare(hash: string, plainText: string): Promise<boolean> {
		return argon2.verify(hash, plainText);
	}

	private static readonly SALT_LENGTH = 16;
	private static readonly HASH_LENGTH = 32;
	private static readonly MEMORY_COST = 19_456;
	private static readonly TIME_COST = 2;
	private static readonly PARALLELISM = 1;
	private static readonly ALGORITHM_VERSION = 13;
	private static readonly TYPE = Argon2AlgorithmType.ARGON2ID;
}

export const Argon2EncryptionProvider: Provider<PasswordEncryptionService> = {
	provide: PASSWORD_ENCRYPTION_PROVIDER,
	useClass: Argon2EncryptionService,
};

@Injectable()
export class JWTEncryptionService implements TokenEncryptionService {
	constructor(config: ConfigService<EnvVariables, true>) {
		this.jwtService = new JWTService(config.get('TOKEN_SECRET'));
	}

	public async verify<T>(cypher: string, schema: Schema<T>): Promise<T> {
		try {
			const payload = await this.jwtService.verify<T>(cypher);
			const result = schema.safeParse(payload.data);

			if (!result.success) {
				throw new UnauthorizedError('Invalid token', UnauthorizedType.InvalidToken);
			}

			return result.data;
		} catch (err) {
			throw new UnauthorizedError('Invalid token', UnauthorizedType.InvalidToken);
		}
	}

	public sign<T>(data: T): string {
		return this.jwtService.sign<T>(data, JWTEncryptionService.TOKEN_EXPIRATION);
	}

	private static readonly TOKEN_EXPIRATION = 60 * 60 * 8; // 8h
	private readonly jwtService: JWTService;
}

export const JWTEncryptionProvider: Provider<TokenEncryptionService> = {
	provide: TOKEN_ENCRYPTION_PROVIDER,
	useClass: JWTEncryptionService,
};
