import { HttpStatus } from '@nestjs/common';
import { AppError, HttpErrorObject } from '../base/AppError';

export const enum AuthenticationType {
	InvalidCredential = 'INVALID_CREDENTIAL',
	InvalidPassword = 'INVALID_PASSWORD',
	RetryExceeded = 'RETRY_EXCEEDED',
}

export class AuthenticationError extends AppError {
	public readonly error: string = 'AUTHENTICATION';
	public readonly type: AuthenticationType;
	public readonly path: string | null;

	public constructor(message: string, type: AuthenticationType, path: string | null = null) {
		super(message);
		this.type = type;
		this.path = path;
	}

	public override httpErrorObject(): HttpErrorObject {
		return {
			status: HttpStatus.UNAUTHORIZED,
			error: this.error,
			message: this.message,
			type: this.type,
			path: this.path,
		};
	}
}
