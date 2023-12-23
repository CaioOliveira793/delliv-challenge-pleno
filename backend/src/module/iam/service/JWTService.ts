import { SignJWT, jwtVerify } from 'jose';

export interface Payload<T> {
	/** Custom payload */
	data: T;
	/**
	 * Issuer
	 *
	 * The "iss" (issuer) claim identifies the principal that issued the
	 * JWT. The processing of this claim is generally application specific.
	 * The "iss" value is a case-sensitive string containing a StringOrURI
	 * value. Use of this claim is OPTIONAL.
	 *
	 * @see https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.1
	 */
	iss: typeof JWT_ISSUER;
	/**
	 * Expiration time (in seconds)
	 *
	 * The "exp" (expiration time) claim identifies the expiration time on
	 * or after which the JWT MUST NOT be accepted for processing. The
	 * processing of the "exp" claim requires that the current date/time
	 * MUST be before the expiration date/time listed in the "exp" claim.
	 *
	 * @see https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.4
	 */
	exp: number;
	/**
	 * Issued at (in seconds)
	 *
	 * The "iat" (issued at) claim identifies the time at which the JWT was
	 * issued. This claim can be used to determine the age of the JWT. Its
	 * value MUST be a number containing a NumericDate value. Use of this
	 * claim is OPTIONAL.
	 *
	 * @see https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.6
	 */
	iat: number;
}

export const JWT_ISSUER = 'challenge-service';

export class JWTService {
	private readonly key: Uint8Array;

	constructor(secret: string) {
		this.key = new TextEncoder().encode(secret);
	}

	public async verify<T>(token: string): Promise<Payload<T>> {
		const result = await jwtVerify<Payload<T>>(token, this.key, {
			requiredClaims: ['iss', 'exp', 'iat'],
			issuer: [JWT_ISSUER],
		});
		return result.payload;
	}

	/**
	 * Signs a new JWT.
	 *
	 * @param data payload
	 * @param expiresIn expiration time (in seconds)
	 * @returns a signed token
	 */
	public sign<T>(data: T, expiresIn: number): Promise<string> {
		return new SignJWT({ data, iss: JWT_ISSUER, exp: expiresIn, iat: Date.now() })
			.setProtectedHeader({ alg: JWTService.ALGORITHM })
			.sign(this.key);
	}

	private static readonly ALGORITHM = 'HS256';
}
