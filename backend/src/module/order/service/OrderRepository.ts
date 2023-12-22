import { EntityID } from '@/module/base/Entity';
import { Order } from '@/module/order/entity/Order';

export interface OrderRepository {
	insert(order: Order): Promise<void>;
	find(id: EntityID): Promise<Order | null>;
	listAll(): Promise<Array<Order>>;
	update(order: Order): Promise<void>;
}

export const ORDER_REPOSITORY_PROVIDER = 'DELIVERY/ORDER_REPOSITORY_PROVIDER';
