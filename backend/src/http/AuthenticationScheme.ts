import { UnauthorizedError, UnauthorizedType } from '@/exception/security/UnauthorizedError';

export function tokenFromBearerAuthScheme(authorization: unknown): string {
	if (!authorization) throw new UnauthorizedError(UnauthorizedType.TokenNotPresent);

	if (typeof authorization !== 'string')
		throw new UnauthorizedError(UnauthorizedType.MalformattedToken);

	const [scheme, tokenCipher] = authorization.toString().split(' ');

	if (scheme !== 'Bearer') throw new UnauthorizedError(UnauthorizedType.MalformattedToken);

	return tokenCipher;
}
