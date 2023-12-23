import { ulid } from 'ulid';
import { faker } from '@faker-js/faker';
import { Order, OrderState } from '@/module/delivery/entity/Order';

export function fakeAddress(): string {
	return faker.location.streetAddress({ useFullAddress: true });
}

export function fakeOrderStatus(): string {
	return faker.helpers.arrayElement(['postado', 'em rota de entrega', 'entregue']);
}

export function fakeOrderState(state: Partial<OrderState> = {}): OrderState {
	const created = state.created ?? faker.date.past();
	return {
		created: state.created ?? faker.date.past(),
		updated: state.updated ?? faker.date.between({ from: created, to: new Date() }),
		creatorId: state.creatorId ?? ulid(),
		status: state.status ?? fakeOrderStatus(),
		customer: state.customer ?? faker.person.fullName(),
		deliveryAddress: state.deliveryAddress ?? fakeAddress(),
	};
}

export function fakeOrder(state: Partial<OrderState> = {}, id = ulid()): Order {
	return Order.restore(id, fakeOrderState(state));
}
