import { describe, it } from 'node:test';
import assert from 'node:assert';
import { UnauthorizedError, UnauthorizedType } from '@/exception/security/UnauthorizedError';
import { tokenFromBearerAuthScheme } from './AuthenticationScheme';

describe('tokenFromBearerAuthScheme', () => {
	const tokenCipher = '#token#';

	it('extract a tokenCipher from a valid formatted authorization header', () => {
		const token = tokenFromBearerAuthScheme('Bearer ' + tokenCipher);

		assert.strictEqual(tokenCipher, token);
	});

	it('throw an error when the request does not have a authorization header', () => {
		assert.throws(
			() => tokenFromBearerAuthScheme(undefined),
			new UnauthorizedError('Token is not present', UnauthorizedType.TokenNotPresent)
		);
	});

	it('throw an error when the authorization header are in a incorrect type', async () => {
		assert.throws(
			() => tokenFromBearerAuthScheme(200129463),
			new UnauthorizedError('Malformatted token', UnauthorizedType.MalformattedToken)
		);
	});

	it('throw an error when extract a tokenCipher from a malformatted authorization header', async () => {
		assert.throws(
			() => tokenFromBearerAuthScheme('Bearer? ' + tokenCipher),
			new UnauthorizedError('Malformatted token', UnauthorizedType.MalformattedToken)
		);
	});
});
