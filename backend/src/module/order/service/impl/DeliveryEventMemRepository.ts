import { uniqueConstraintViolationMessage } from '@/exception/Message';
import { Optional, Provider } from '@nestjs/common';
import { DeliveryEventState, DeliveryEvent } from '@/module/order/entity/DeliveryEvent';
import {
	DELIVERY_EVENT_REPOSITORY_PROVIDER,
	DeliveryEventRepository,
} from '@/module/order/service/DeliveryEventRepository';

export class DeliveryEventMemRepository implements DeliveryEventRepository {
	protected readonly events: Map<string, DeliveryEventState>;

	constructor(@Optional() events: Map<string, DeliveryEventState> = new Map()) {
		this.events = events;
	}

	public async insert(event: DeliveryEvent): Promise<void> {
		if (this.events.get(event.id)) {
			throw new Error(DeliveryEventMemRepository.UNIQUE_ID_MESSAGE);
		}

		this.events.set(event.id, event.internalState());
	}

	public async find(id: string): Promise<DeliveryEvent | null> {
		const state = this.events.get(id);
		if (state) {
			return DeliveryEvent.restore(id, structuredClone(state));
		}
		return null;
	}

	// TODO: implement query methods in a `DeliveryEventQuery` interface
	public async listAll(): Promise<DeliveryEvent[]> {
		const orders = [];

		for (const [id, state] of this.events.entries()) {
			orders.push(DeliveryEvent.restore(id, structuredClone(state)));
		}

		return orders;
	}

	private static readonly UNIQUE_ID_MESSAGE = uniqueConstraintViolationMessage('unique_id');
}

export const DeliveryEventRepositoryProvider: Provider<DeliveryEventRepository> = {
	provide: DELIVERY_EVENT_REPOSITORY_PROVIDER,
	useClass: DeliveryEventMemRepository,
};
