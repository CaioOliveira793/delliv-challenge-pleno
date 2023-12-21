import { InvalidDataIssue } from '@/common/type';
import { AppError, HttpErrorObject } from '@/exception/base/AppError';
import { HttpStatus } from '@nestjs/common';

export class ValidationError extends AppError {
	public readonly error: string = 'VALIDATION';
	public readonly issues: InvalidDataIssue[];

	constructor(issues: InvalidDataIssue[]) {
		super('Validation error');
		this.issues = issues;
	}

	public override httpErrorObject(): HttpErrorObject {
		return {
			status: HttpStatus.BAD_REQUEST,
			error: this.error,
			message: this.message,
			issues: this.issues,
		};
	}
}
