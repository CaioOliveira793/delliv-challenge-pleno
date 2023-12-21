import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from '@/http/types';
import { UserCredentialSchema } from '@/module/iam/validation/Schema';
import { AuthenticationError, AuthenticationType } from '@/exception/security/AuthenticationError';

export const ReqCredential = createParamDecorator<void, ExecutionContext, unknown>(
	(_: void, ctx: ExecutionContext): unknown => {
		const request = ctx.switchToHttp().getRequest<Request>();

		const result = UserCredentialSchema.safeParse(request.body);
		if (!result.success) {
			throw new AuthenticationError('Invalid credential', AuthenticationType.InvalidCredential);
		}

		return result.data;
	}
);
