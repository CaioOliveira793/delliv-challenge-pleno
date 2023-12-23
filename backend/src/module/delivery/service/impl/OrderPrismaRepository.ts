import {
	PrismaClient,
	Order as OrderTuple,
	DeliveryEvent as DeliveryEventTuple,
} from '@prisma/client';
import { Inject, Injectable, Provider } from '@nestjs/common';
import { PRISMA_SERVICE_PROVIDER, PrismaService } from '@/module/base/service/PrismaService';
import { Order, OrderState } from '@/module/delivery/entity/Order';
import {
	DeliveryEventQueryParams,
	ORDER_REPOSITORY_PROVIDER,
	OrderQueryParams,
	OrderRepository,
} from '@/module/delivery/service/OrderRepository';
import { DeliveryEventResource, OrderResource } from '@/module/delivery/dto/Resource';
import { DeliveryEvent, DeliveryEventState } from '@/module/delivery/entity/DeliveryEvent';

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

function tupleToDeliveryEventState(tuple: DeliveryEventTuple): DeliveryEventState {
	return {
		created: tuple.created,
		creatorId: tuple.creator_id,
		orderId: tuple.order_id,
		status: tuple.status,
		message: tuple.message,
	};
}

function tupleToDeliveryEventResource(tuple: DeliveryEventTuple): DeliveryEventResource {
	return {
		id: tuple.id,
		created: tuple.created,
		creator_id: tuple.creator_id,
		order_id: tuple.order_id,
		status: tuple.status,
		message: tuple.message,
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

	public async update(order: Order): Promise<void> {
		await this.prisma.order.update({
			where: { id: order.id },
			data: {
				updated: order.updated,
				status: order.status,
			},
		});
	}

	public async insertEvent(event: DeliveryEvent, order: Order): Promise<void> {
		await this.prisma.$transaction(async prisma => {
			await prisma.deliveryEvent.create({
				data: {
					id: event.id,
					created: event.created,
					creator_id: event.creatorId,
					order_id: event.orderId,
					status: event.status,
					message: event.message,
				},
			});
			await prisma.order.update({
				where: { id: order.id },
				data: {
					updated: order.updated,
					status: order.status,
				},
			});
		});
	}

	public async findEvent(id: string): Promise<DeliveryEvent | null> {
		const tuple = await this.prisma.deliveryEvent.findUnique({
			where: { id },
		});

		if (!tuple) return null;
		return DeliveryEvent.restore(tuple.id, tupleToDeliveryEventState(tuple));
	}

	public async query(params: OrderQueryParams): Promise<OrderResource[]> {
		const tuples = await this.prisma.order.findMany({
			where: {
				creator_id: params.creator_id,
				status: params.status ? { contains: params.status } : undefined,
			},
			orderBy: {
				created: 'desc',
			},
		});

		return tuples.map(tupleToOrderResource);
	}

	public async queryEvents(
		params: DeliveryEventQueryParams
	): Promise<Array<DeliveryEventResource>> {
		const tuples = await this.prisma.deliveryEvent.findMany({
			where: {
				creator_id: params.creator_id,
				order_id: params.order_id,
			},
			orderBy: {
				created: 'desc',
			},
		});

		return tuples.map(tupleToDeliveryEventResource);
	}
}

export const OrderPrismaRepositoryProvider: Provider<OrderRepository> = {
	provide: ORDER_REPOSITORY_PROVIDER,
	useClass: OrderPrismaRepository,
};
