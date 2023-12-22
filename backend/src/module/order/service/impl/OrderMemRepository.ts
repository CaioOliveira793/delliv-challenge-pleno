import { Injectable, Optional, Provider } from '@nestjs/common';
import { uniqueConstraintViolationMessage } from '@/exception/Message';
import { ResourceNotFound } from '@/exception/resource/ResourceNotFound';
import { OrderState, Order } from '@/module/order/entity/Order';
import { OrderRepository, ORDER_REPOSITORY_PROVIDER } from '@/module/order/service/OrderRepository';

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

	// TODO: implement query methods in a `OrderQuery` interface
	public async listAll(): Promise<Array<Order>> {
		const orders = [];

		for (const [id, state] of this.orders.entries()) {
			orders.push(Order.restore(id, structuredClone(state)));
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
