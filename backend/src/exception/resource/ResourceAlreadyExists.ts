import { HttpStatus } from '@nestjs/common';
import { AppError, HttpErrorObject } from '@/exception/base/AppError';
import { ResourceLocation } from '@/common/type';

export class ResourceAlreadyExists extends AppError {
	public readonly error: string = 'RESOURCE_ALREADY_EXISTS';
	public readonly resources: ResourceLocation[];

	constructor(message: string, resources: ResourceLocation[] = []) {
		super(message);
		this.resources = resources;
	}

	public override httpErrorObject(): HttpErrorObject {
		return {
			status: HttpStatus.BAD_REQUEST,
			error: this.error,
			message: this.message,
			resources: this.resources,
		};
	}
}
