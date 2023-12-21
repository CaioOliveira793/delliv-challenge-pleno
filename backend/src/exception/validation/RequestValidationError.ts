import { ZodIssue } from 'zod';
import { HttpStatus } from '@nestjs/common';
import { RequestSegment } from '@/http/types';
import { AppError, HttpErrorObject } from '@/exception/base/AppError';
import { InvalidDataIssue, makeInvalidDataIssueFromZodIssue } from '@/common/type';

export class RequestValidationError extends AppError {
	public readonly error: string = 'VALIDATION';
	public readonly segment: RequestSegment;
	public readonly issues: InvalidDataIssue[];

	public constructor(segment: RequestSegment, issues: InvalidDataIssue[]) {
		super('Request validation error');
		this.segment = segment;
		this.issues = issues;
	}

	public static fromZodIssue(segment: RequestSegment, issues: ZodIssue[]) {
		return new RequestValidationError(segment, issues.map(makeInvalidDataIssueFromZodIssue));
	}

	public override httpErrorObject(): HttpErrorObject {
		return {
			status: HttpStatus.BAD_REQUEST,
			error: this.error,
			segment: this.segment,
			message: this.message,
			issues: this.issues,
		};
	}
}
