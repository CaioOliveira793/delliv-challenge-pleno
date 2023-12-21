import { HttpStatus } from '@nestjs/common';
import { AppError, HttpErrorObject } from '@/exception/base/AppError';
import { ResourceLocation } from '@/common/type';

export class ResourceNotFound extends AppError {
	public readonly error: string = 'NOT_FOUND';
	public readonly resources: ResourceLocation[];

	constructor(message: string, resources: ResourceLocation[] = []) {
		super(message);
		this.resources = resources;
	}

	public override httpErrorObject(): HttpErrorObject {
		return {
			status: HttpStatus.NOT_FOUND,
			error: this.error,
			message: this.message,
			resources: this.resources,
		};
	}
}
