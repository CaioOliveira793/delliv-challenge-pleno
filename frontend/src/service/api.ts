import type {
	CreateDeliveryEventData,
	CreateOrderData,
	CreateUserData,
	DeliveryEventQuery,
	OrderQuery,
	UserCredential,
} from '@/service/Resource';
import type { CreateOrderResponse, GetOrderResponse, ListOrderResponse } from '@/service/order';
import type {
	AuthenticateUserResponse,
	CreateUserResponse,
	GetAuthenticatedUserResponse,
} from '@/service/iam';
import {
	CreateDeliveryEventResponse,
	GetDeliveryEventResponse,
	ListDeliveryEventResponse,
} from '@/service/deliveryEvent';

export interface API {
	createUser(data: CreateUserData, signal?: AbortSignal | null): Promise<CreateUserResponse>;
	authenticateUser(data: UserCredential): Promise<AuthenticateUserResponse>;
	getAuthenticatedUser(token: string): Promise<GetAuthenticatedUserResponse>;

	createOrder(
		data: CreateOrderData,
		token: string,
		signal?: AbortSignal | null
	): Promise<CreateOrderResponse>;
	getOrder(id: string, token: string): Promise<GetOrderResponse>;
	listOrder(query: OrderQuery, token: string): Promise<ListOrderResponse>;

	createDeliveryEvent(
		data: CreateDeliveryEventData,
		token: string,
		signal?: AbortSignal | null
	): Promise<CreateDeliveryEventResponse>;
	getDeliveryEvent(id: string, token: string): Promise<GetDeliveryEventResponse>;
	listDeliveryEvent(query: DeliveryEventQuery, token: string): Promise<ListDeliveryEventResponse>;
}
