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
import { SignedUser, CreateOrderData, Order, OrderQuery } from '@/service/Resource';
import { jsonSerializer } from '@/util/serde';

export type CreateOrderError =
	| ResultType<ResponseType.UNAUTHORIZED, UnauthorizedError>
	| ResultType<ResponseType.API_ERROR, ApiError>;

export type CreateOrderOk = ResultType<ResponseType.CREATED, Order>;

export type CreateOrderResponse = CreateOrderOk | CreateOrderError;

export async function createOrder(
	data: CreateOrderData,
	token: string,
	signal: AbortSignal | null = null
): Promise<CreateOrderResponse> {
	const headers = new Headers();
	headers.set(HeaderName.ContentType, JSON_MIMETYPE);
	headers.set(HeaderName.Accept, JSON_MIMETYPE);
	headers.set(HeaderName.Authorization, bearerAuthScheme(token));

	const request = new Request(apiEndpoint('/delivery/order'), {
		method: HttpMethod.POST,
		headers,
		body: jsonSerializer(data),
		signal,
		mode: 'cors',
	});

	return applicationApiFetch(request, [ResponseType.CREATED, ResponseType.UNAUTHORIZED]);
}

export type GetOrderError =
	| ResultType<ResponseType.NOT_FOUND, NotFoundError>
	| ResultType<ResponseType.UNAUTHORIZED, UnauthorizedError>
	| ResultType<ResponseType.API_ERROR, ApiError>;

export type GetOrderOk = ResultType<ResponseType.OK, SignedUser>;

export type GetOrderResponse = GetOrderOk | GetOrderError;

export async function getOrder(id: string, token: string): Promise<GetOrderResponse> {
	const headers = new Headers();
	headers.set(HeaderName.Accept, JSON_MIMETYPE);
	headers.set(HeaderName.Authorization, bearerAuthScheme(token));

	const request = new Request(apiEndpoint('/delivery/order/' + id), {
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

export type ListOrderError =
	| ResultType<ResponseType.UNAUTHORIZED, UnauthorizedError>
	| ResultType<ResponseType.API_ERROR, ApiError>;

export type ListOrderOk = ResultType<ResponseType.OK, Array<Order>>;

export type ListOrderResponse = ListOrderOk | ListOrderError;

export function applyOrderQuery(
	query: OrderQuery,
	params: URLSearchParams = new URLSearchParams()
): URLSearchParams {
	if (query.status) params.set('status', query.status);
	return params;
}

export async function listOrder(query: OrderQuery, token: string): Promise<ListOrderResponse> {
	const headers = new Headers();
	headers.set(HeaderName.Accept, JSON_MIMETYPE);
	headers.set(HeaderName.Authorization, bearerAuthScheme(token));

	const url = new URL(apiEndpoint('/delivery/order'));
	applyOrderQuery(query, url.searchParams);

	const request = new Request(url, {
		method: HttpMethod.GET,
		headers,
		mode: 'cors',
		cache: 'default',
	});

	return applicationApiFetch(request, [ResponseType.OK, ResponseType.UNAUTHORIZED]);
}
