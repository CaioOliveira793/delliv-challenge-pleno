import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { ResourceNotFound } from '@/exception/resource/ResourceNotFound';
import { ReqHeader } from '@/decorator/ReqHeader';
import { AccessTokenPipe } from '@/pipe/AccessTokenPipe';
import { SchemaPipe } from '@/pipe/SchemaPipe';
import { UlidSchema } from '@/validation/Schema';
import { AuthService } from '@/module/iam/service/AuthService';
import { Token } from '@/module/iam/type/Token';
import { CreateDeliveryEventData, DeliveryEvent } from '@/module/order/entity/DeliveryEvent';
import { DeliveryEventResource, makeDeliveryEventResource } from '@/module/order/dto/Resource';
import {
	DELIVERY_EVENT_REPOSITORY_PROVIDER,
	DeliveryEventRepository,
} from '@/module/order/service/DeliveryEventRepository';
import { CreateDeliveryEventSchema } from '@/module/order/validation/Schema';
import { ORDER_REPOSITORY_PROVIDER, OrderRepository } from '@/module/order/service/OrderRepository';

@Controller('event')
export class DeliveryEventController {
	constructor(
		@Inject(DELIVERY_EVENT_REPOSITORY_PROVIDER)
		private readonly deliveryEventRepository: DeliveryEventRepository,
		@Inject(ORDER_REPOSITORY_PROVIDER)
		private readonly orderRepository: OrderRepository,
		private readonly authService: AuthService
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	public async create(
		@ReqHeader('authorization', AccessTokenPipe) token: Token<string>,
		@Body(new SchemaPipe(CreateDeliveryEventSchema)) data: CreateDeliveryEventData
	): Promise<DeliveryEventResource> {
		const user = await this.authService.getAuthenticatedUser(token);

		const order = await this.orderRepository.find(data.order_id);
		if (!order) {
			throw new ResourceNotFound('Order not found', {
				resource_type: 'ORDER',
				key: 'id:' + data.order_id,
				path: '.order_id',
			});
		}

		const event = DeliveryEvent.create(data, user.id);
		order.updateStatus(event.status);

		// FIXME: open a transaction to write both values
		await this.deliveryEventRepository.insert(event);
		await this.orderRepository.update(order);

		return makeDeliveryEventResource(event);
	}

	@Get(':id')
	@HttpCode(HttpStatus.CREATED)
	public async get(
		@ReqHeader('authorization', AccessTokenPipe) token: Token<string>,
		@Param('id', new SchemaPipe(UlidSchema)) id: string
	): Promise<DeliveryEventResource> {
		await this.authService.getAuthenticatedUser(token);

		const event = await this.deliveryEventRepository.find(id);
		if (!event) {
			throw new ResourceNotFound('Order not found', {
				resource_type: 'DELIVERY_EVENT',
				key: 'id:' + id,
				path: null,
			});
		}

		return makeDeliveryEventResource(event);
	}

	@Get()
	@HttpCode(HttpStatus.CREATED)
	public async list(
		@ReqHeader('authorization', AccessTokenPipe) token: Token<string>
	): Promise<Array<DeliveryEventResource>> {
		await this.authService.getAuthenticatedUser(token);

		const events = await this.deliveryEventRepository.listAll();
		return events.map(makeDeliveryEventResource);
	}
}
