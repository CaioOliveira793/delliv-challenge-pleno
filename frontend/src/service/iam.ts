import {
	HeaderName,
	HttpMethod,
	ResultType,
	apiEndpoint,
	bearerAuthScheme,
	ApiError,
	ConflictError,
	NotFoundError,
	UnauthorizedError,
	ResponseType,
	applicationApiFetch,
	JSON_MIMETYPE,
} from '@/service/common';
import { CreateUserData, SignedUser, User, UserCredential } from '@/service/Resource';
import { jsonSerializer } from '@/util/serde';

export type CreateUserError =
	| ResultType<ResponseType.CONFLICT, ConflictError>
	| ResultType<ResponseType.UNAUTHORIZED, UnauthorizedError>
	| ResultType<ResponseType.API_ERROR, ApiError>;

export type CreateUserOk = ResultType<ResponseType.CREATED, SignedUser>;

export type CreateUserResponse = CreateUserOk | CreateUserError;

export async function createUser(
	data: CreateUserData,
	signal: AbortSignal | null = null
): Promise<CreateUserResponse> {
	const headers = new Headers();
	headers.set(HeaderName.ContentType, JSON_MIMETYPE);
	headers.set(HeaderName.Accept, JSON_MIMETYPE);

	const request = new Request(apiEndpoint('/iam/user'), {
		method: HttpMethod.POST,
		headers,
		body: jsonSerializer(data),
		signal,
		mode: 'cors',
	});

	return applicationApiFetch(request, [
		ResponseType.CREATED,
		ResponseType.CONFLICT,
		ResponseType.UNAUTHORIZED,
	]);
}

export type AuthenticateUserError =
	| ResultType<ResponseType.NOT_FOUND, NotFoundError>
	| ResultType<ResponseType.UNAUTHORIZED, UnauthorizedError>
	| ResultType<ResponseType.API_ERROR, ApiError>;

export type AuthenticateUserOk = ResultType<ResponseType.OK, SignedUser>;

export type AuthenticateUserResponse = AuthenticateUserOk | AuthenticateUserError;

export async function authenticateUser(data: UserCredential): Promise<AuthenticateUserResponse> {
	const headers = new Headers();
	headers.set(HeaderName.ContentType, JSON_MIMETYPE);
	headers.set(HeaderName.Accept, JSON_MIMETYPE);

	const request = new Request(apiEndpoint('/iam/auth'), {
		method: HttpMethod.POST,
		headers,
		body: jsonSerializer(data),
		mode: 'cors',
	});

	return applicationApiFetch(request, [
		ResponseType.OK,
		ResponseType.NOT_FOUND,
		ResponseType.UNAUTHORIZED,
	]);
}

export type GetAuthenticatedUserResponse =
	| ResultType<ResponseType.OK, User>
	| ResultType<ResponseType.UNAUTHORIZED, UnauthorizedError>
	| ResultType<ResponseType.API_ERROR, ApiError>;

export async function getAuthenticatedUser(token: string): Promise<GetAuthenticatedUserResponse> {
	const headers = new Headers();
	headers.set(HeaderName.Accept, JSON_MIMETYPE);
	headers.set(HeaderName.Authorization, bearerAuthScheme(token));

	const request = new Request(apiEndpoint('/iam/user/me'), {
		method: HttpMethod.GET,
		headers,
		mode: 'cors',
		cache: 'default',
	});

	return applicationApiFetch(request, [ResponseType.OK, ResponseType.UNAUTHORIZED]);
}
