import { randomBytes } from 'node:crypto';
import { default as argon2 } from 'argon2';
import { Injectable, Provider } from '@nestjs/common';
import {
	PASSWORD_ENCRYPTION_PROVIDER,
	PasswordEncryptionService,
} from '@/module/iam/service/EncryptionService';

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
