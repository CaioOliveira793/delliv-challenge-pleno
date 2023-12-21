import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HeaderValue, Request } from '@/http/types';

export const ReqHeader = createParamDecorator<string, ExecutionContext, unknown>(
	(headerKey: string, ctx: ExecutionContext): HeaderValue => {
		const request = ctx.switchToHttp().getRequest<Request>();
		return request.headers[headerKey];
	}
);
