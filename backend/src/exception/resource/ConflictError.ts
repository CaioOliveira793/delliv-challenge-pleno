import { HttpStatus } from '@nestjs/common';
import { AppError, HttpErrorObject } from '@/exception/base/AppError';
import { ResourceLocation } from '@/common/type';

export class ConflictError extends AppError {
	public readonly error = 'CONFLICT';
	public readonly resources: ResourceLocation[];

	constructor(message: string, resources: ResourceLocation[] = []) {
		super(message);
		this.resources = resources;
	}

	public override httpErrorObject(): HttpErrorObject {
		return {
			status: HttpStatus.CONFLICT,
			error: this.error,
			message: this.message,
			resources: this.resources,
		};
	}
}
