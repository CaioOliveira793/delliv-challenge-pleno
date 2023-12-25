import { API } from '@/service/api';
import { createUser, authenticateUser, getAuthenticatedUser } from '@/service/iam';
import { createOrder, getOrder, listOrder } from '@/service/order';
import { createDeliveryEvent, getDeliveryEvent, listDeliveryEvent } from '@/service/deliveryEvent';

export const ServiceAPI: API = {
	createUser,
	authenticateUser,
	getAuthenticatedUser,

	createOrder,
	getOrder,
	listOrder,

	createDeliveryEvent,
	getDeliveryEvent,
	listDeliveryEvent,
};
