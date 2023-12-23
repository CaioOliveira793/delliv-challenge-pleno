import { Inject, Injectable, Provider } from '@nestjs/common';
import { PrismaClient, DeliveryEvent as DeliveryEventTuple } from '@prisma/client';
import { PRISMA_SERVICE_PROVIDER, PrismaService } from '@/module/base/service/PrismaService';
import { DeliveryEvent, DeliveryEventState } from '@/module/delivery/entity/DeliveryEvent';
import { DeliveryEventResource } from '@/module/delivery/dto/Resource';
import {
	DELIVERY_EVENT_REPOSITORY_PROVIDER,
	DeliveryEventQueryParams,
	DeliveryEventRepository,
} from '@/module/delivery/service/DeliveryEventRepository';

function mapTupleToDeliveryEventState(tuple: DeliveryEventTuple): DeliveryEventState {
	return {
		created: tuple.created,
		creatorId: tuple.creator_id,
		orderId: tuple.order_id,
		status: tuple.status,
		message: tuple.message,
	};
}

function mapTupleToDeliveryEventResource(tuple: DeliveryEventTuple): DeliveryEventResource {
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
export class DeliveryEventPrismaRepository implements DeliveryEventRepository {
	private readonly prisma: PrismaClient;

	constructor(
		@Inject(PRISMA_SERVICE_PROVIDER)
		prismaService: PrismaService
	) {
		this.prisma = prismaService.prisma;
	}

	public async insert(event: DeliveryEvent): Promise<void> {
		await this.prisma.deliveryEvent.create({
			data: {
				id: event.id,
				created: event.created,
				creator_id: event.creatorId,
				order_id: event.orderId,
				status: event.status,
				message: event.message,
			},
		});
	}

	public async find(id: string): Promise<DeliveryEvent | null> {
		const tuple = await this.prisma.deliveryEvent.findUnique({
			where: { id },
		});

		if (!tuple) return null;
		return DeliveryEvent.restore(tuple.id, mapTupleToDeliveryEventState(tuple));
	}

	public async query(params: DeliveryEventQueryParams): Promise<Array<DeliveryEventResource>> {
		const tuples = await this.prisma.deliveryEvent.findMany({
			where: {
				creator_id: params.creator_id,
				order_id: params.order_id,
			},
		});

		return tuples.map(mapTupleToDeliveryEventResource);
	}
}

export const DeliveryEventPrismaRepositoryProvider: Provider<DeliveryEventRepository> = {
	provide: DELIVERY_EVENT_REPOSITORY_PROVIDER,
	useClass: DeliveryEventPrismaRepository,
};
