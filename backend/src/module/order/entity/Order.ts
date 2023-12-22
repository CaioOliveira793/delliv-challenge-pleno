import { ulid } from 'ulid';
import { Entity, EntityID } from '@/module/base/Entity';

export interface OrderState {
	created: Date;
	updated: Date;
	creatorId: string;
	customer: string;
	deliveryAddress: string;
	status: string;
}

export interface CreateOrderData {
	customer_name: string;
	delivery_address: string;
	status: string;
}

export class Order extends Entity<OrderState> {
	public static create(data: CreateOrderData, creator: string): Order {
		const now = new Date();
		return new Order(ulid(), {
			created: now,
			updated: now,
			creatorId: creator,
			customer: data.customer_name,
			deliveryAddress: data.delivery_address,
			status: data.status,
		});
	}

	public static restore(id: EntityID, state: OrderState): Order {
		return new Order(id, state);
	}

	public updateStatus(status: string): void {
		this.state.status = status;
		this.state.updated = new Date();
	}

	public get created(): Date {
		return this.state.created;
	}
	public get updated(): Date {
		return this.state.updated;
	}
	public get creatorId(): string {
		return this.state.creatorId;
	}
	public get customer(): string {
		return this.state.customer;
	}
	public get deliveryAddress(): string {
		return this.state.deliveryAddress;
	}
	public get status(): string {
		return this.state.status;
	}
}
