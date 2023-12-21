import JWT from 'jsonwebtoken';

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
	exp?: number;
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
	iat?: number;
}

export const JWT_ISSUER = 'challenge-service';

export class JWTService {
	private readonly secret: string;

	constructor(secret: string) {
		this.secret = secret;
	}

	public verify<T>(token: string): Promise<Payload<T>> {
		return new Promise((resolve, reject) => {
			JWT.verify(token.toString(), this.secret, (err: JWT.VerifyErrors | null, decode) => {
				if (err) {
					reject(err);
					return;
				}

				resolve(decode as Payload<T>);
			});
		});
	}

	public sign<T>(data: T, expiresIn: number): string {
		return JWT.sign({ data }, this.secret, { expiresIn, issuer: JWT_ISSUER });
	}
}
