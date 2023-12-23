import { Schema } from 'zod';
import { ulid } from 'ulid';
import { UlidSchema } from '@/validation/Schema';
import { TokenEncryptionService } from '@/module/iam/service/EncryptionService';
import { Token } from '@/module/iam/type/Token';

class FakeEncryptionService implements TokenEncryptionService {
	public async verify<T>(cypher: string, schema: Schema<T>): Promise<T> {
		if (!cypher.startsWith('###') && !cypher.endsWith('###')) {
			throw new Error('INVALID_DATA');
		}

		const data = cypher.slice(3, -3);
		const result = schema.safeParse(data);
		if (!result.success) {
			throw new Error('INVALID_DATA');
		}

		return result.data;
	}

	public async sign<T>(data: T): Promise<string> {
		return `###${data}###`;
	}
}

describe('Token type', () => {
	const fakeEncripter = new FakeEncryptionService();

	it('create a new token with the signer result', async () => {
		const id = ulid();
		const token = await Token.new(id, fakeEncripter);

		expect(`###${id}###`).toStrictEqual(token.toString());
		expect(id).toStrictEqual(token.data);
	});

	it('create a token from a verified cypher text', async () => {
		const id = ulid();
		const cypherText = `###${id}###`;

		const token = await Token.verify(cypherText, fakeEncripter, UlidSchema);

		expect(cypherText).toStrictEqual(token.valueOf());
		expect(id).toStrictEqual(token.data);
	});

	it('throw error verifying a invalid cypher text', async () => {
		const id = ulid();
		const cypherText = `#$#${id}#$#`;

		await expect(() => Token.verify(cypherText, fakeEncripter, UlidSchema)).rejects.toThrow(
			new Error('INVALID_DATA')
		);
	});
});
