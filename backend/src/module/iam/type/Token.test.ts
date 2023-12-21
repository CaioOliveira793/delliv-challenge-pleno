import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Schema } from 'zod';
import { ulid } from 'ulid';
import { UlidSchema } from '@/validation/Schema';
import { TokenEncryptionService } from '@/module/iam/service/EncryptionService';
import { Token } from '@/module/iam/type/Token';

class FakeEncryptionService implements TokenEncryptionService {
	public async verify<T>(cypher: string, schema: Schema<T>): Promise<T> {
		const data = cypher.slice(3, -3);
		const result = schema.safeParse(data);
		if (!result.success) {
			throw new Error('INVALID_DATA');
		}

		return result.data;
	}

	public sign<T>(data: T): string | Promise<string> {
		return `###${data}###`;
	}
}

describe('Token type', () => {
	const fakeEncripter = new FakeEncryptionService();

	it('create a new token with the signer result', async () => {
		const id = ulid();
		const token = await Token.new(id, fakeEncripter);

		assert.strictEqual(`###${id}###`, token.toString());
		assert.strictEqual(id, token.data);
	});

	it('create a token from a token cypher', async () => {
		const id = ulid();
		const tokenCypher = `###${id}###`;

		const token = await Token.verify(tokenCypher, fakeEncripter, UlidSchema);

		assert.strictEqual(tokenCypher, token.toString());
		assert.strictEqual(id, token.data);
	});
});
