import { PrismaClient, Order as PrismaOrder } from '@prisma/client';
import { Inject, Injectable, Provider } from '@nestjs/common';
import { Order, OrderState } from '@/module/order/entity/Order';
import { ORDER_REPOSITORY_PROVIDER, OrderRepository } from '@/module/order/service/OrderRepository';
import { PRISMA_SERVICE_PROVIDER, PrismaService } from '@/module/base/service/PrismaService';

function dbToOrderState(dbOrder: PrismaOrder): OrderState {
	return {
		created: dbOrder.created,
		updated: dbOrder.updated,
		creatorId: dbOrder.creator_id,
		customer: dbOrder.customer_name,
		deliveryAddress: dbOrder.delivery_address,
		status: dbOrder.status,
	};
}

@Injectable()
export class OrderPrismaRepository implements OrderRepository {
	private readonly prisma: PrismaClient;

	constructor(
		@Inject(PRISMA_SERVICE_PROVIDER)
		prismaService: PrismaService
	) {
		this.prisma = prismaService.prisma;
	}

	public async insert(order: Order): Promise<void> {
		await this.prisma.order.create({
			data: {
				id: order.id,
				created: order.created,
				updated: order.updated,
				creator_id: order.creatorId,
				customer_name: order.customer,
				delivery_address: order.deliveryAddress,
				status: order.status,
			},
		});
	}

	public async find(id: string): Promise<Order | null> {
		const dbOrder = await this.prisma.order.findUnique({
			where: { id },
		});

		if (!dbOrder) return null;
		return Order.restore(dbOrder.id, dbToOrderState(dbOrder));
	}

	public async listAll(): Promise<Order[]> {
		const orders = await this.prisma.order.findMany();
		return orders.map(order => Order.restore(order.id, dbToOrderState(order)));
	}

	public async update(order: Order): Promise<void> {
		await this.prisma.order.update({
			where: { id: order.id },
			data: {
				updated: order.updated,
				status: order.status,
			},
		});
	}
}

export const OrderPrismaRepositoryProvider: Provider<OrderRepository> = {
	provide: ORDER_REPOSITORY_PROVIDER,
	useClass: OrderPrismaRepository,
};
