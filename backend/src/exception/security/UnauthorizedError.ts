import { HttpStatus } from '@nestjs/common';
import { AppError, HttpErrorObject } from '../base/AppError';

export const enum UnauthorizedType {
	TokenNotPresent = 'TOKEN_NOT_PRESENT',
	MalformattedToken = 'MALFORMATTED_TOKEN',
	InvalidToken = 'INVALID_TOKEN',
	InvalidCredential = 'INVALID_CREDENTIAL',
	InvalidPassword = 'INVALID_PASSWORD',
}

export class UnauthorizedError extends AppError {
	public readonly error: string = 'UNAUTHORIZED';
	public readonly type: UnauthorizedType;

	constructor(type: UnauthorizedType) {
		super(UnauthorizedError.messageFromType(type));
		this.type = type;
	}

	public override httpErrorObject(): HttpErrorObject {
		return {
			status: HttpStatus.UNAUTHORIZED,
			error: this.error,
			type: this.type,
			message: this.message,
		};
	}

	public static messageFromType(type: UnauthorizedType): string {
		switch (type) {
			case UnauthorizedType.TokenNotPresent:
				return 'Token is not present';
			case UnauthorizedType.MalformattedToken:
				return 'Malformatted token';
			case UnauthorizedType.InvalidToken:
				return 'Invalid token';
			case UnauthorizedType.InvalidCredential:
				return 'Invalid credential';
			case UnauthorizedType.InvalidPassword:
				return 'Invalid password';
			default:
				return 'Unauthorized error';
		}
	}
}
