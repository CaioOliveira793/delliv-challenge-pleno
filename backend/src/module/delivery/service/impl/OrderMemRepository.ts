import { Injectable, Optional, Provider } from '@nestjs/common';
import { uniqueConstraintViolationMessage } from '@/exception/Message';
import { ResourceNotFound } from '@/exception/resource/ResourceNotFound';
import { OrderState, Order } from '@/module/delivery/entity/Order';
import {
	OrderRepository,
	ORDER_REPOSITORY_PROVIDER,
	OrderQueryParams,
	DeliveryEventQueryParams,
} from '@/module/delivery/service/OrderRepository';
import { DeliveryEventResource, OrderResource } from '@/module/delivery/dto/Resource';
import { DeliveryEvent, DeliveryEventState } from '@/module/delivery/entity/DeliveryEvent';

function mapIdStateToOrderResource(id: string, state: OrderState): OrderResource {
	return {
		id,
		created: state.created,
		updated: state.updated,
		creator_id: state.creatorId,
		customer_name: state.customer,
		delivery_address: state.deliveryAddress,
		status: state.status,
	};
}

function mapIdStateToDeliveryEventResource(
	id: string,
	state: DeliveryEventState
): DeliveryEventResource {
	return {
		id,
		created: state.created,
		creator_id: state.creatorId,
		order_id: state.orderId,
		status: state.status,
		message: state.message,
	};
}

@Injectable()
export class OrderMemRepository implements OrderRepository {
	protected readonly orders: Map<string, OrderState>;
	protected readonly events: Map<string, DeliveryEventState>;

	public constructor(
		@Optional() orders: Map<string, OrderState> = new Map(),
		@Optional() events: Map<string, DeliveryEventState> = new Map()
	) {
		this.orders = orders;
		this.events = events;
	}

	public async insert(order: Order): Promise<void> {
		if (this.orders.get(order.id)) {
			throw new Error(OrderMemRepository.ORDER_UNIQUE_ID_MESSAGE);
		}

		this.orders.set(order.id, order.internalState());
	}

	public async find(id: string): Promise<Order | null> {
		const state = this.orders.get(id);
		if (state) {
			return Order.restore(id, structuredClone(state));
		}
		return null;
	}

	public async update(order: Order): Promise<void> {
		const state = this.orders.get(order.id);
		if (!state) {
			throw new ResourceNotFound({
				key: 'id:' + order.id,
				path: null,
				resource_type: 'ORDER',
			});
		}

		this.orders.set(order.id, order.internalState());
	}

	public async insertEvent(event: DeliveryEvent, order: Order): Promise<void> {
		if (this.events.get(event.id)) {
			throw new Error(OrderMemRepository.DELIVERY_EVENT_UNIQUE_ID_MESSAGE);
		}

		await this.update(order);
		this.events.set(event.id, event.internalState());
	}

	public async findEvent(id: string): Promise<DeliveryEvent | null> {
		const state = this.events.get(id);
		if (state) {
			return DeliveryEvent.restore(id, structuredClone(state));
		}
		return null;
	}

	public async query(params: OrderQueryParams): Promise<Array<OrderResource>> {
		const orders: Array<OrderResource> = [];

		for (const [id, state] of this.orders.entries()) {
			// WHERE order.creator_id == {creator_id}
			if (params.creator_id && state.creatorId !== params.creator_id) {
				continue;
			}
			// WHERE order.status LIKE %{status}%
			if (params.status && !state.status.includes(params.status)) {
				continue;
			}

			orders.push(mapIdStateToOrderResource(id, state));
		}

		// ORDER BY created DESC
		orders.sort((a, b) => b.created.getTime() - a.created.getTime());
		return orders;
	}

	public async queryEvents(
		params: DeliveryEventQueryParams
	): Promise<Array<DeliveryEventResource>> {
		const events: Array<DeliveryEventResource> = [];

		for (const [id, state] of this.events.entries()) {
			// WHERE order.creator_id == {creator_id}
			if (params.creator_id && state.creatorId !== params.creator_id) {
				continue;
			}
			// WHERE order.order_id == {order_id}
			if (params.order_id && state.orderId !== params.order_id) {
				continue;
			}

			events.push(mapIdStateToDeliveryEventResource(id, state));
		}

		// ORDER BY created DESC
		events.sort((a, b) => b.created.getTime() - a.created.getTime());
		return events;
	}

	public static readonly ORDER_UNIQUE_ID_MESSAGE =
		uniqueConstraintViolationMessage('order_unique_id');
	public static readonly DELIVERY_EVENT_UNIQUE_ID_MESSAGE = uniqueConstraintViolationMessage(
		'delivery_event_unique_id'
	);
}

export const OrderRepositoryProvider: Provider<OrderRepository> = {
	provide: ORDER_REPOSITORY_PROVIDER,
	useClass: OrderMemRepository,
};
