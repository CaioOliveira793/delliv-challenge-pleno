import { EntityID } from '@/module/base/Entity';
import { Order } from '@/module/delivery/entity/Order';
import { DeliveryEvent } from '@/module/delivery/entity/DeliveryEvent';
import { DeliveryEventResource, OrderResource } from '@/module/delivery/dto/Resource';

export interface OrderQueryParams {
	creator_id?: string;
	status?: string;
}

export interface DeliveryEventQueryParams {
	order_id?: string;
	creator_id?: string;
}

export interface OrderRepository {
	/**
	 * Inserts a new order.
	 *
	 * @param order new order
	 */
	insert(order: Order): Promise<void>;
	/**
	 * Finds the order by its ID.
	 *
	 * @param id order id
	 * @returns optional order
	 */
	find(id: EntityID): Promise<Order | null>;
	/**
	 * Updates the order state.
	 *
	 * @param order order for update
	 */
	update(order: Order): Promise<void>;

	/**
	 * Inserts a new delivery event ans updates the order state atomically.
	 *
	 * @param {DeliveryEvent} event new delivery event for the order
	 * @param {Order} order the order being updated
	 */
	insertEvent(event: DeliveryEvent, order: Order): Promise<void>;
	/**
	 * Finds the delivery event by its ID.
	 *
	 * @param id delivery event id
	 * @returns optional delivery event
	 */
	findEvent(id: string): Promise<DeliveryEvent | null>;

	/**
	 * Query a list of orders.
	 *
	 * @param params order query params
	 */
	query(params: OrderQueryParams): Promise<Array<OrderResource>>;
	/**
	 * Query a list of delivery events.
	 *
	 * @param params delivery event query params
	 */
	queryEvents(params: DeliveryEventQueryParams): Promise<Array<DeliveryEventResource>>;
}

export const ORDER_REPOSITORY_PROVIDER = 'DELIVERY/ORDER_REPOSITORY_PROVIDER';
