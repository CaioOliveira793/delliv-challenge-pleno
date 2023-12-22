import { Order } from '@/module/order/entity/Order';

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
