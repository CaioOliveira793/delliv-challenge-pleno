import { Inject, Injectable, Provider } from '@nestjs/common';
import { PrismaClient, DeliveryEvent as DeliveryEventDb } from '@prisma/client';
import {
	DELIVERY_EVENT_REPOSITORY_PROVIDER,
	DeliveryEventRepository,
} from '@/module/order/service/DeliveryEventRepository';
import { DeliveryEvent, DeliveryEventState } from '@/module/order/entity/DeliveryEvent';
import { PRISMA_SERVICE_PROVIDER, PrismaService } from '@/module/base/service/PrismaService';

function mapDBtoState(db: DeliveryEventDb): DeliveryEventState {
	return {
		created: db.created,
		creatorId: db.creator_id,
		orderId: db.order_id,
		status: db.status,
		message: db.message,
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
		const db = await this.prisma.deliveryEvent.findUnique({
			where: { id },
		});

		if (!db) return null;
		return DeliveryEvent.restore(db.id, mapDBtoState(db));
	}

	public async listAll(): Promise<DeliveryEvent[]> {
		const tuples = await this.prisma.deliveryEvent.findMany();
		return tuples.map(order => DeliveryEvent.restore(order.id, mapDBtoState(order)));
	}
}

export const DeliveryEventPrismaRepositoryProvider: Provider<DeliveryEventRepository> = {
	provide: DELIVERY_EVENT_REPOSITORY_PROVIDER,
	useClass: DeliveryEventPrismaRepository,
};
