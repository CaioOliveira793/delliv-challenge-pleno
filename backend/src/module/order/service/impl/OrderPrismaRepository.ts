import { PrismaClient, Order as OrderTuple } from '@prisma/client';
import { Inject, Injectable, Provider } from '@nestjs/common';
import { PRISMA_SERVICE_PROVIDER, PrismaService } from '@/module/base/service/PrismaService';
import { Order, OrderState } from '@/module/order/entity/Order';
import {
	ORDER_REPOSITORY_PROVIDER,
	OrderQueryParams,
	OrderRepository,
} from '@/module/order/service/OrderRepository';
import { OrderResource } from '@/module/order/dto/Resource';

function tupleToOrderState(tuple: OrderTuple): OrderState {
	return {
		created: tuple.created,
		updated: tuple.updated,
		creatorId: tuple.creator_id,
		customer: tuple.customer_name,
		deliveryAddress: tuple.delivery_address,
		status: tuple.status,
	};
}

function tupleToOrderResource(tuple: OrderTuple): OrderResource {
	return {
		id: tuple.id,
		created: tuple.created,
		updated: tuple.updated,
		creator_id: tuple.creator_id,
		customer_name: tuple.customer_name,
		delivery_address: tuple.delivery_address,
		status: tuple.status,
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
		const tuple = await this.prisma.order.findUnique({
			where: { id },
		});

		if (!tuple) return null;
		return Order.restore(tuple.id, tupleToOrderState(tuple));
	}

	public async query(params: OrderQueryParams): Promise<OrderResource[]> {
		const tuples = await this.prisma.order.findMany({
			where: {
				creator_id: params.creator_id,
				status: params.status ? { contains: params.status } : undefined,
			},
		});

		return tuples.map(tupleToOrderResource);
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
