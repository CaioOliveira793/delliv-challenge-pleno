import { EntityID } from '@/module/base/Entity';
import { Order } from '@/module/order/entity/Order';
import { OrderResource } from '@/module/order/dto/Resource';

export interface OrderQueryParams {
	creator_id?: string;
	status?: string;
}

export interface OrderRepository {
	insert(order: Order): Promise<void>;
	find(id: EntityID): Promise<Order | null>;
	update(order: Order): Promise<void>;

	query(params: OrderQueryParams): Promise<Array<OrderResource>>;
}

export const ORDER_REPOSITORY_PROVIDER = 'DELIVERY/ORDER_REPOSITORY_PROVIDER';
