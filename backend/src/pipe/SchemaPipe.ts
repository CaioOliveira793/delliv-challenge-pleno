import { ArgumentMetadata, Injectable, Optional, PipeTransform } from '@nestjs/common';
import { Schema } from 'zod';
import { RequestValidationError } from '@/exception/validation/RequestValidationError';
import { requestSegmentFromParamType } from '@/http/types';

@Injectable()
export class SchemaPipe<T> implements PipeTransform {
	public constructor(
		@Optional()
		private readonly schema: Schema<T>
	) {}

	public async transform(value: unknown, metadata: ArgumentMetadata) {
		const result = await this.schema.safeParseAsync(value);
		if (!result.success) {
			throw RequestValidationError.fromZodIssue(
				requestSegmentFromParamType(metadata.type),
				result.error.issues
			);
		}

		return result.data;
	}
}
