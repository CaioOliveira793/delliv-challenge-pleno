import {
	ResultType,
	UnauthorizedError,
	ApiError,
	HeaderName,
	JSON_MIMETYPE,
	bearerAuthScheme,
	apiEndpoint,
	HttpMethod,
	applicationApiFetch,
	ResponseType,
	NotFoundError,
} from '@/service/common';
import {
	SignedUser,
	CreateDeliveryEventData,
	DeliveryEvent,
	DeliveryEventQuery,
} from '@/service/Resource';
import { jsonSerializer } from '@/util/serde';

export type CreateDeliveryEventError =
	| ResultType<ResponseType.NOT_FOUND, NotFoundError>
	| ResultType<ResponseType.UNAUTHORIZED, UnauthorizedError>
	| ResultType<ResponseType.API_ERROR, ApiError>;

export type CreateDeliveryEventOk = ResultType<ResponseType.CREATED, DeliveryEvent>;

export type CreateDeliveryEventResponse = CreateDeliveryEventOk | CreateDeliveryEventError;

export async function createDeliveryEvent(
	data: CreateDeliveryEventData,
	token: string,
	signal: AbortSignal | null = null
): Promise<CreateDeliveryEventResponse> {
	const headers = new Headers();
	headers.set(HeaderName.ContentType, JSON_MIMETYPE);
	headers.set(HeaderName.Accept, JSON_MIMETYPE);
	headers.set(HeaderName.Authorization, bearerAuthScheme(token));

	const request = new Request(apiEndpoint('/delivery/event'), {
		method: HttpMethod.POST,
		headers,
		body: jsonSerializer(data),
		signal,
		mode: 'cors',
	});

	return applicationApiFetch(request, [ResponseType.CREATED, ResponseType.UNAUTHORIZED]);
}

export type GetDeliveryEventError =
	| ResultType<ResponseType.NOT_FOUND, NotFoundError>
	| ResultType<ResponseType.UNAUTHORIZED, UnauthorizedError>
	| ResultType<ResponseType.API_ERROR, ApiError>;

export type GetDeliveryEventOk = ResultType<ResponseType.OK, SignedUser>;

export type GetDeliveryEventResponse = GetDeliveryEventOk | GetDeliveryEventError;

export async function getDeliveryEvent(
	id: string,
	token: string
): Promise<GetDeliveryEventResponse> {
	const headers = new Headers();
	headers.set(HeaderName.Accept, JSON_MIMETYPE);
	headers.set(HeaderName.Authorization, bearerAuthScheme(token));

	const request = new Request(apiEndpoint('/delivery/event/' + id), {
		method: HttpMethod.GET,
		headers,
		mode: 'cors',
		cache: 'default',
	});

	return applicationApiFetch(request, [
		ResponseType.OK,
		ResponseType.NOT_FOUND,
		ResponseType.UNAUTHORIZED,
	]);
}

export type ListDeliveryEventError =
	| ResultType<ResponseType.UNAUTHORIZED, UnauthorizedError>
	| ResultType<ResponseType.API_ERROR, ApiError>;

export type ListDeliveryEventOk = ResultType<ResponseType.OK, SignedUser>;

export type ListDeliveryEventResponse = ListDeliveryEventOk | ListDeliveryEventError;

export function applyDeliveryEventQuery(
	query: DeliveryEventQuery,
	params: URLSearchParams = new URLSearchParams()
): URLSearchParams {
	if (query.order_id) params.set('order_id', query.order_id);
	return params;
}

export async function listDeliveryEvent(
	query: DeliveryEventQuery,
	token: string
): Promise<ListDeliveryEventResponse> {
	const headers = new Headers();
	headers.set(HeaderName.Accept, JSON_MIMETYPE);
	headers.set(HeaderName.Authorization, bearerAuthScheme(token));

	const url = new URL(apiEndpoint('/delivery/event'));
	applyDeliveryEventQuery(query, url.searchParams);

	const request = new Request(url, {
		method: HttpMethod.GET,
		headers,
		mode: 'cors',
		cache: 'default',
	});

	return applicationApiFetch(request, [ResponseType.OK, ResponseType.UNAUTHORIZED]);
}
