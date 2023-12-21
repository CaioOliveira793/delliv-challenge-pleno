import { HttpStatus } from '@nestjs/common';
import { AppError, HttpErrorObject } from '../base/AppError';

export const enum UnauthorizedType {
	InvalidAuthorization = 'INVALID_AUTHORIZATION',
	TokenNotPresent = 'TOKEN_NOT_PRESENT',
	MalformattedToken = 'MALFORMATTED_TOKEN',
	InvalidToken = 'INVALID_TOKEN',
}

export class UnauthorizedError extends AppError {
	public readonly error: string = 'UNAUTHORIZED';
	public readonly type: UnauthorizedType;

	constructor(message: string, type: UnauthorizedType) {
		super(message);
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
}
