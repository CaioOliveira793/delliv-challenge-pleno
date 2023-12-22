import { Schema } from 'zod';

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
