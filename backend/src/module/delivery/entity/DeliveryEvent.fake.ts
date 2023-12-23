import { ulid } from 'ulid';
import { faker } from '@faker-js/faker';
import { DeliveryEvent, DeliveryEventState } from '@/module/delivery/entity/DeliveryEvent';
import { fakeOrderStatus } from './Order.fake';

export function fakeDeliveryEventMessage(): string | null {
	return faker.helpers.arrayElement([faker.lorem.words({ min: 5, max: 13 }), null]);
}

export function fakeDeliveryEventState(
	state: Partial<DeliveryEventState> = {}
): DeliveryEventState {
	return {
		created: state.created ?? faker.date.past(),
		creatorId: state.creatorId ?? ulid(),
		orderId: state.orderId ?? ulid(),
		status: state.status ?? fakeOrderStatus(),
		message: state.message === undefined ? fakeDeliveryEventMessage() : state.message,
	};
}

export function fakeDeliveryEvent(
	state: Partial<DeliveryEventState> = {},
	id = ulid()
): DeliveryEvent {
	return DeliveryEvent.restore(id, fakeDeliveryEventState(state));
}
