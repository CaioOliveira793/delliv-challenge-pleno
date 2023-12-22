import { HttpStatus } from '@nestjs/common';
import { AppError, HttpErrorObject } from '@/exception/base/AppError';
import { ResourceLocation } from '@/common/type';

export class ConflictError extends AppError {
	public readonly error = 'CONFLICT';
	public readonly resource: ResourceLocation;

	constructor(message: string, resource: ResourceLocation) {
		super(message);
		this.resource = resource;
	}

	public override httpErrorObject(): HttpErrorObject {
		return {
			status: HttpStatus.CONFLICT,
			error: this.error,
			message: this.message,
			resource: this.resource,
		};
	}
}
