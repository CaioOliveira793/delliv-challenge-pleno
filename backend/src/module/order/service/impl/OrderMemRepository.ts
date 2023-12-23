import { Injectable, Optional, Provider } from '@nestjs/common';
import { uniqueConstraintViolationMessage } from '@/exception/Message';
import { ResourceNotFound } from '@/exception/resource/ResourceNotFound';
import { OrderState, Order } from '@/module/order/entity/Order';
import {
	OrderRepository,
	ORDER_REPOSITORY_PROVIDER,
	OrderQueryParams,
} from '@/module/order/service/OrderRepository';
import { OrderResource } from '@/module/order/dto/Resource';

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

@Injectable()
export class OrderMemRepository implements OrderRepository {
	protected readonly orders: Map<string, OrderState>;

	public constructor(@Optional() orders: Map<string, OrderState> = new Map()) {
		this.orders = orders;
	}

	public async insert(order: Order): Promise<void> {
		if (this.orders.get(order.id)) {
			throw new Error(OrderMemRepository.UNIQUE_ID_MESSAGE);
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

	public async query(params: OrderQueryParams): Promise<Array<OrderResource>> {
		const orders: Array<OrderResource> = [];

		for (const [id, state] of this.orders.entries()) {
			if (params.creator_id && state.creatorId !== params.creator_id) {
				continue;
			}
			if (params.status && !state.status.includes(params.status)) {
				continue;
			}

			orders.push(mapIdStateToOrderResource(id, state));
		}

		return orders;
	}

	public async update(order: Order): Promise<void> {
		const state = this.orders.get(order.id);
		if (!state) {
			throw new ResourceNotFound('Resource not found', {
				key: 'id:' + order.id,
				path: null,
				resource_type: 'USER',
			});
		}

		this.orders.set(order.id, order.internalState());
	}

	private static readonly UNIQUE_ID_MESSAGE = uniqueConstraintViolationMessage('unique_id');
}

export const OrderRepositoryProvider: Provider<OrderRepository> = {
	provide: ORDER_REPOSITORY_PROVIDER,
	useClass: OrderMemRepository,
};
