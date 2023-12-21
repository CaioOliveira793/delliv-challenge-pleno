import { HttpStatus } from '@nestjs/common';
import { AppError, HttpErrorObject } from '../base/AppError';

export const enum ForbiddenErrorType {
	AccessDenied = 'ACCESS_DENIED',
}

export class ForbiddenError extends AppError {
	public readonly error: string = 'FORBIDDEN';
	public readonly type: ForbiddenErrorType;

	public constructor(message: string, type = ForbiddenErrorType.AccessDenied) {
		super(message);
		this.type = type;
	}

	public static fromAction(action: string): ForbiddenError {
		return new ForbiddenError('Access denied for ' + action);
	}

	public override httpErrorObject(): HttpErrorObject {
		return {
			status: HttpStatus.FORBIDDEN,
			error: this.error,
			type: this.type,
			message: this.message,
		};
	}
}
