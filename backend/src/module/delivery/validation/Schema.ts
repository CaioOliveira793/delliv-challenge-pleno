import { z } from 'zod';
import { PersonNameSchema, UlidSchema } from '@/validation/Schema';

export const AddressSchema = z.string().min(3).max(512);

export const OrderStatusSchema = z.string().min(1).max(128);

export const CreateOrderSchema = z.object({
	customer_name: PersonNameSchema,
	delivery_address: AddressSchema,
	status: OrderStatusSchema,
});

export const DeliveryEventMessageSchema = z.string().min(3).max(1024);

export const CreateDeliveryEventSchema = z.object({
	order_id: UlidSchema,
	status: OrderStatusSchema,
	message: DeliveryEventMessageSchema,
});
