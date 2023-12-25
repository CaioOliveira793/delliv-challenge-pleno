export interface User {
	readonly id: string;
	readonly created: Date;
	readonly updated: Date;
	readonly name: string;
	readonly email: string;
	readonly last_authentication: Date;
}

export interface UserCredential {
	email: string;
	password: string;
}

export interface CreateUserData {
	name: string;
	email: string;
	password: string;
}

export interface DeliveryEvent {
	readonly id: string;
	readonly created: Date;
	readonly creator_id: string;
	readonly order_id: string;
	readonly status: string;
	readonly message: string | null;
}

export interface DeliveryEventQuery {
	order_id?: string;
}

export interface CreateDeliveryEventData {
	order_id: string;
	status: string;
	message: string | null;
}

export interface Order {
	readonly id: string;
	readonly created: Date;
	readonly updated: Date;
	readonly creator_id: string;
	readonly status: string;
	readonly customer_name: string;
	readonly delivery_address: string;
}

export interface OrderQuery {
	status?: string;
}

export interface CreateOrderData {
	status: string;
	customer_name: string;
	delivery_address: string;
}

export interface SignedUser {
	user: User;
	token: string;
}
