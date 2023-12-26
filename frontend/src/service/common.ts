import { jsonDeserializer } from '@/util/serde';

export const JSON_MIMETYPE = 'application/json';

export const enum HttpMethod {
	POST = 'POST',
	PUT = 'PUT',
	GET = 'GET',
	DELETE = 'DELETE',
}

export const enum HeaderName {
	ContentType = 'Content-Type',
	Accept = 'Accept',
	Authorization = 'Authorization',
}

export const enum HttpStatus {
	CONTINUE = 100,
	SWITCHING_PROTOCOLS = 101,
	PROCESSING = 102,
	EARLYHINTS = 103,
	OK = 200,
	CREATED = 201,
	ACCEPTED = 202,
	NON_AUTHORITATIVE_INFORMATION = 203,
	NO_CONTENT = 204,
	RESET_CONTENT = 205,
	PARTIAL_CONTENT = 206,
	AMBIGUOUS = 300,
	MOVED_PERMANENTLY = 301,
	FOUND = 302,
	SEE_OTHER = 303,
	NOT_MODIFIED = 304,
	TEMPORARY_REDIRECT = 307,
	PERMANENT_REDIRECT = 308,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	PAYMENT_REQUIRED = 402,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	METHOD_NOT_ALLOWED = 405,
	NOT_ACCEPTABLE = 406,
	PROXY_AUTHENTICATION_REQUIRED = 407,
	REQUEST_TIMEOUT = 408,
	CONFLICT = 409,
	GONE = 410,
	LENGTH_REQUIRED = 411,
	PRECONDITION_FAILED = 412,
	PAYLOAD_TOO_LARGE = 413,
	URI_TOO_LONG = 414,
	UNSUPPORTED_MEDIA_TYPE = 415,
	REQUESTED_RANGE_NOT_SATISFIABLE = 416,
	EXPECTATION_FAILED = 417,
	I_AM_A_TEAPOT = 418,
	MISDIRECTED = 421,
	UNPROCESSABLE_ENTITY = 422,
	FAILED_DEPENDENCY = 424,
	PRECONDITION_REQUIRED = 428,
	TOO_MANY_REQUESTS = 429,
	INTERNAL_SERVER_ERROR = 500,
	NOT_IMPLEMENTED = 501,
	BAD_GATEWAY = 502,
	SERVICE_UNAVAILABLE = 503,
	GATEWAY_TIMEOUT = 504,
	HTTP_VERSION_NOT_SUPPORTED = 505,
}

export type ResultType<Descriminant, Type> = {
	type: Descriminant;
	value: Type;
};

export type ResponseResult<Ok, Err> = ResultType<true, Ok> | ResultType<false, Err>;

export interface ErrorResponse {
	status: number;
	message: string;
}

export type ResourceName = 'USER' | 'ORDER' | 'DELIVERY_EVENT';

export interface ResourceLocation {
	readonly path: string | null;
	readonly key: string;
	readonly resource_type: ResourceName;
}

export const enum DataIssueType {
	InvalidContent = 'invalid_content',
	InvalidType = 'invalid_type',
	InvalidLiteral = 'invalid_literal',
	Custom = 'custom',
	InvalidUnion = 'invalid_union',
	InvalidUnionDiscriminator = 'invalid_union_discriminator',
	InvalidEnumValue = 'invalid_enum_value',
	UnrecognizedKeys = 'unrecognized_keys',
	InvalidArguments = 'invalid_arguments',
	InvalidReturnType = 'invalid_return_type',
	InvalidDate = 'invalid_date',
	InvalidString = 'invalid_string',
	TooSmall = 'too_small',
	TooBig = 'too_big',
	InvalidIntersectionTypes = 'invalid_intersection_types',
	NotMultipleOf = 'not_multiple_of',
	NotFinite = 'not_finite',
}

export interface InvalidDataIssue {
	readonly message: string;
	readonly path: string | null;
	readonly type: DataIssueType;
}

export interface ValidationError extends ErrorResponse {
	readonly error: 'VALIDATION';
	readonly issues: Array<InvalidDataIssue>;
}

export interface NotFoundError extends ErrorResponse {
	readonly type: 'NOT_FOUND';
	readonly resource: ResourceLocation;
}

export interface ConflictError extends ErrorResponse {
	readonly error: 'CONFLICT';
	readonly resource: ResourceLocation;
}

export const enum UnauthorizedType {
	TokenNotPresent = 'TOKEN_NOT_PRESENT',
	MalformattedToken = 'MALFORMATTED_TOKEN',
	InvalidToken = 'INVALID_TOKEN',
	InvalidCredential = 'INVALID_CREDENTIAL',
	InvalidPassword = 'INVALID_PASSWORD',
}

export interface UnauthorizedError extends ErrorResponse {
	readonly error: 'UNAUTHORIZED';
	readonly type: UnauthorizedType;
}

export const enum ForbiddenErrorType {
	AccessDenied = 'ACCESS_DENIED',
}

export interface ForbiddenError extends ErrorResponse {
	readonly error: 'FORBIDDEN';
	readonly type: ForbiddenErrorType;
}

export const enum ResponseType {
	/** HTTP Status OK */
	OK = 200,
	/** HTTP Status CREATED */
	CREATED = 201,
	/** HTTP Status NOT_FOUND */
	NOT_FOUND = 404,
	/** HTTP Status BAD_REQUEST */
	VALIDATION = 400,
	/** HTTP Status CONFLICT */
	CONFLICT = 409,
	/** HTTP Status FORBIDDEN */
	FORBIDDEN = 403,
	/** HTTP Status UNAUTHORIZED */
	UNAUTHORIZED = 401,
	/** Api error */
	API_ERROR = 0,
}

export const enum ApiErrorType {
	/**
	 * The server returned a response type not expected by the deserializer.
	 */
	UnknownResponse = 'UNKNOWN_RESPONSE',
	InvalidResponseBody = 'INVALID_RESPONSE_BODY',
	/**
	 * The fetch api was called with invalid arguments.
	 */
	InvalidFetchCall = 'INVALID_FETCH',
	Aborted = 'ABORTED',
	/**
	 * A network error was encountered.
	 */
	NetworkError = 'NETWORK_ERROR',
	UnknownError = 'UNKNOWN_ERROR',
}

/**
 * Regex to match fetch Error messages
 *
 * ## WebKit (Safari)
 *
 * The default error message returned by WebKit in any network request that fails synchronously
 * is assumed to be an access control error. [Source code](https://github.com/WebKit/WebKit/blob/a7a424ab6eb48fee09affb42ac3e1eea7b47b562/Source/WebCore/loader/cache/CachedResourceLoader.cpp#L1211-L1213).
 *
 * Example message: `Fetch API cannot load https://example.com/whatever due to access control checks`.
 *
 * Match regex: `/fetch api/i`.
 *
 * ## Blink (Chrome, Chromium, Microsoft Edge)
 *
 * Example message: `Failed to fetch`.
 *
 * Match regex: `/failed to fetch/i`.
 *
 * ## Gecko (Firefox)
 *
 * Example message: `NetworkError when attempting to fetch resource.`.
 *
 * Match regex: `/network/i`.
 */
const NETWORK_ERROR_MESSAGE_REGEX = /(network|failed to fetch|fetch api)/i;

/**
 * `DOMException` error type with name `'AbortError'`
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMException
 */
const ABORT_ERROR_TYPE_NAME = 'AbortError';

/**
 * `DOMException` error type with name `'NetworkError'`
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMException
 */
const NETWORK_ERROR_TYPE_NAME = 'NetworkError';

export class ApiError extends Error {
	public readonly type: ApiErrorType;
	public readonly data: unknown;
	public readonly status: number | null;

	constructor(type: ApiErrorType, status: number | null = null, data?: unknown, cause?: Error) {
		super('api error ' + type, { cause });
		this.type = type;
		this.data = data;
		this.status = status;
	}

	public static async unknownResponse(response: Response, cause?: Error): Promise<ApiError> {
		const data = response.bodyUsed ? null : await response.text();
		return new ApiError(ApiErrorType.UnknownResponse, response.status, data, cause);
	}

	public static handleFetchError(err: unknown): ApiError {
		if (!(err instanceof Error)) {
			return new ApiError(ApiErrorType.UnknownError, null, undefined);
		}

		if (err.name === ABORT_ERROR_TYPE_NAME) {
			return new ApiError(ApiErrorType.Aborted, null, undefined, err);
		}

		if (err.name === NETWORK_ERROR_TYPE_NAME || NETWORK_ERROR_MESSAGE_REGEX.test(err.message)) {
			return new ApiError(ApiErrorType.NetworkError, null, undefined, err);
		}

		return new ApiError(ApiErrorType.InvalidFetchCall, null, undefined, err);
	}
}

export type GenericResourceResponse<Resource> =
	| ResultType<ResponseType.OK, Resource>
	| ResultType<ResponseType.VALIDATION, ValidationError>
	| ResultType<ResponseType.NOT_FOUND, NotFoundError>
	| ResultType<ResponseType.CONFLICT, ConflictError>
	| ResultType<ResponseType.FORBIDDEN, ForbiddenError>
	| ResultType<ResponseType.UNAUTHORIZED, UnauthorizedError>
	| ResultType<ResponseType.API_ERROR, ApiError>;

export function apiEndpoint(path: string): string {
	return import.meta.env.APP_API_ADDRESS + path;
}

export function bearerAuthScheme(token: string): string {
	return 'Bearer ' + token;
}

export async function safeFetch(request: Request): Promise<ApiError | Response> {
	try {
		return await fetch(request);
	} catch (err: unknown) {
		return ApiError.handleFetchError(err);
	}
}

export async function parseResponse<T = unknown>(response: Response): Promise<T | ApiError> {
	const str = await response.text();
	try {
		return jsonDeserializer(str);
	} catch (err: unknown) {
		return new ApiError(ApiErrorType.InvalidResponseBody, response.status, str, err as Error);
	}
}

export async function applicationApiFetch<
	Type extends ResponseType,
	Value,
	TResponse extends ResultType<Type, Value>,
>(request: Request, knownResponseTypes: Array<ResponseType>): Promise<TResponse> {
	const response = await safeFetch(request);
	if (response instanceof ApiError) {
		return { type: ResponseType.API_ERROR, value: response } as unknown as TResponse;
	}

	if (knownResponseTypes.includes(response.status)) {
		const value = await parseResponse(response);
		if (value instanceof ApiError) {
			return { type: ResponseType.API_ERROR, value } as unknown as TResponse;
		}
		return { type: response.status, value } as unknown as TResponse;
	}

	return {
		type: ResponseType.API_ERROR,
		value: await ApiError.unknownResponse(response),
	} as unknown as TResponse;
}

export function throwApiError<
	Type extends ResponseType,
	Ok,
	Err,
	Res extends ResultType<Type, Ok> | ResultType<ResponseType, Err>,
>(response: Res, successType: Type): Ok {
	if (response.type === successType) {
		return response.value as Ok;
	}
	throw response; // return never;
}

export function throwApiResponse<
	Type extends ResponseType,
	Ok,
	Err,
	Res extends ResultType<Type, Ok> | ResultType<ResponseType, Err>,
>(response: Res, successType: Type): Res {
	if (response.type === successType) {
		return response;
	}
	throw response; // return never;
}
