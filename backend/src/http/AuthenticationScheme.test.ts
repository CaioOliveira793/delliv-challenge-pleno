import { UnauthorizedError, UnauthorizedType } from '@/exception/security/UnauthorizedError';
import { tokenFromBearerAuthScheme } from './AuthenticationScheme';

describe('tokenFromBearerAuthScheme', () => {
	const tokenCipher = '#token#';

	it('extract a tokenCipher from a valid formatted authorization header', () => {
		const token = tokenFromBearerAuthScheme('Bearer ' + tokenCipher);

		expect(tokenCipher).toStrictEqual(token);
	});

	it('throw an error when the request does not have a authorization header', () => {
		expect(() => tokenFromBearerAuthScheme(undefined)).toThrow(
			new UnauthorizedError(UnauthorizedType.TokenNotPresent)
		);
	});

	it('throw an error when the authorization header are in a incorrect type', async () => {
		expect(() => tokenFromBearerAuthScheme(200129463)).toThrow(
			new UnauthorizedError(UnauthorizedType.MalformattedToken)
		);
	});

	it('throw an error when extract a tokenCipher from a malformatted authorization header', async () => {
		expect(() => tokenFromBearerAuthScheme('Bearer? ' + tokenCipher)).toThrow(
			new UnauthorizedError(UnauthorizedType.MalformattedToken)
		);
	});
});
