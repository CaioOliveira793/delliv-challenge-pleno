import { z } from 'zod';
import { PersonNameSchema } from '@/validation/Schema';

export const AddressSchema = z.string().min(3).max(512);

export const OrderStatusSchema = z.string().min(1).max(128);

export const CreateOrderSchema = z.object({
	customer_name: PersonNameSchema,
	delivery_address: AddressSchema,
	status: OrderStatusSchema,
});
