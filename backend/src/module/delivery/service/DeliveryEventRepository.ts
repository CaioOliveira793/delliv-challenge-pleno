import { EntityID } from '@/module/base/Entity';
import { DeliveryEvent } from '@/module/delivery/entity/DeliveryEvent';
import { DeliveryEventResource } from '../dto/Resource';

export interface DeliveryEventQueryParams {
	order_id?: string;
	creator_id?: string;
}

export interface DeliveryEventRepository {
	insert(event: DeliveryEvent): Promise<void>;
	find(id: EntityID): Promise<DeliveryEvent | null>;

	query(params: DeliveryEventQueryParams): Promise<Array<DeliveryEventResource>>;
}

export const DELIVERY_EVENT_REPOSITORY_PROVIDER = 'DELIVERY/DELIVERY_EVENT_REPOSITORY_PROVIDER';
