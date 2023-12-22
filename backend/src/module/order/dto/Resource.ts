import { Order } from '@/module/order/entity/Order';
import { DeliveryEvent } from '@/module/order/entity/DeliveryEvent';

export interface OrderResource {
	id: string;
	created: Date;
	updated: Date;
	creator_id: string;
	customer_name: string;
	delivery_address: string;
	status: string;
}

export function makeOrderResource(order: Order): OrderResource {
	return {
		id: order.id,
		created: order.created,
		updated: order.updated,
		creator_id: order.creatorId,
		customer_name: order.customer,
		delivery_address: order.deliveryAddress,
		status: order.status,
	};
}

export interface DeliveryEventResource {
	id: string;
	created: Date;
	creator_id: string;
	order_id: string;
	status: string;
	message: string | null;
}

export function makeDeliveryEventResource(deliveryEvent: DeliveryEvent): DeliveryEventResource {
	return {
		id: deliveryEvent.id,
		created: deliveryEvent.created,
		creator_id: deliveryEvent.creatorId,
		order_id: deliveryEvent.orderId,
		status: deliveryEvent.status,
		message: deliveryEvent.message,
	};
}
