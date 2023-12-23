import { Optional, Provider } from '@nestjs/common';
import { uniqueConstraintViolationMessage } from '@/exception/Message';
import { DeliveryEventState, DeliveryEvent } from '@/module/delivery/entity/DeliveryEvent';
import { DeliveryEventResource } from '@/module/delivery/dto/Resource';
import {
	DELIVERY_EVENT_REPOSITORY_PROVIDER,
	DeliveryEventQueryParams,
	DeliveryEventRepository,
} from '@/module/delivery/service/DeliveryEventRepository';

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

	public async query(params: DeliveryEventQueryParams): Promise<Array<DeliveryEventResource>> {
		const events: Array<DeliveryEventResource> = [];

		for (const [id, state] of this.events.entries()) {
			if (params.creator_id && state.creatorId !== params.creator_id) {
				continue;
			}
			if (params.order_id && state.orderId !== params.order_id) {
				continue;
			}

			events.push(mapIdStateToDeliveryEventResource(id, state));
		}

		return events;
	}

	private static readonly UNIQUE_ID_MESSAGE = uniqueConstraintViolationMessage('unique_id');
}

export const DeliveryEventRepositoryProvider: Provider<DeliveryEventRepository> = {
	provide: DELIVERY_EVENT_REPOSITORY_PROVIDER,
	useClass: DeliveryEventMemRepository,
};
