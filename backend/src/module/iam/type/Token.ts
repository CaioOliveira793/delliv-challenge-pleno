import { TokenEncryptionService } from '@/module/iam/service/EncryptionService';
import { z } from 'zod';

export class Token<Data> {
	public static async new<T>(data: T, encrypter: TokenEncryptionService): Promise<Token<T>> {
		const token = await encrypter.sign(data);
		return new Token(token, data);
	}

	public static async verify<T>(
		token: string,
		encrypter: TokenEncryptionService,
		schema: z.Schema<T>
	): Promise<Token<T>> {
		const data = await encrypter.verify<T>(token, schema);
		return new Token(token, data);
	}

	public readonly data: Data;

	private constructor(tokenString: string, data: Data) {
		this.token = tokenString;
		this.data = data;
	}

	public toString(): string {
		return this.token;
	}
	public valueOf(): string {
		return this.token;
	}

	private readonly token: string;
}

export type AuthToken = Token<string>;
