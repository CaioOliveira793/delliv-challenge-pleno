import { EntityID } from '@/module/base/Entity';
import { DeliveryEvent } from '@/module/order/entity/DeliveryEvent';

export interface DeliveryEventRepository {
	insert(event: DeliveryEvent): Promise<void>;
	find(id: EntityID): Promise<DeliveryEvent | null>;
	listAll(): Promise<Array<DeliveryEvent>>;
}

export const DELIVERY_EVENT_REPOSITORY_PROVIDER = 'DELIVERY/DELIVERY_EVENT_REPOSITORY_PROVIDER';
