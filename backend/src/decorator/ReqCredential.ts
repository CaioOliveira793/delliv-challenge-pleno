import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from '@/http/types';
import { UnauthorizedError, UnauthorizedType } from '@/exception/security/UnauthorizedError';
import { UserCredentialSchema } from '@/module/iam/validation/Schema';

export const ReqCredential = createParamDecorator<void, ExecutionContext, unknown>(
	(_: void, ctx: ExecutionContext): unknown => {
		const request = ctx.switchToHttp().getRequest<Request>();

		const result = UserCredentialSchema.safeParse(request.body);
		if (!result.success) {
			throw new UnauthorizedError('Invalid credential', UnauthorizedType.InvalidCredential);
		}

		return result.data;
	}
);
