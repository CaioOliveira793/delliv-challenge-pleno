import { ulid } from 'ulid';
import { Entity, EntityID } from '@/module/base/Entity';

export interface DeliveryEventState {
	created: Date;
	creatorId: string;
	orderId: string;
	status: string;
	message: string | null;
}

export interface CreateDeliveryEventData {
	order_id: string;
	status: string;
	message: string | null;
}

export class DeliveryEvent extends Entity<DeliveryEventState> {
	public static create(data: CreateDeliveryEventData, creator: string): DeliveryEvent {
		const now = new Date();
		return new DeliveryEvent(ulid(), {
			created: now,
			creatorId: creator,
			orderId: data.order_id,
			status: data.status,
			message: data.message,
		});
	}

	public static restore(id: EntityID, state: DeliveryEventState): DeliveryEvent {
		return new DeliveryEvent(id, state);
	}

	public get created(): Date {
		return this.state.created;
	}
	public get creatorId(): string {
		return this.state.creatorId;
	}
	public get orderId(): string {
		return this.state.orderId;
	}
	public get status(): string {
		return this.state.status;
	}
	public get message(): string | null {
		return this.state.message;
	}
}
