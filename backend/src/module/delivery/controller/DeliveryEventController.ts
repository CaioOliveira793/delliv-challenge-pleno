import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { ResourceNotFound } from '@/exception/resource/ResourceNotFound';
import { ReqHeader } from '@/decorator/ReqHeader';
import { AccessTokenPipe } from '@/pipe/AccessTokenPipe';
import { SchemaPipe } from '@/pipe/SchemaPipe';
import { UlidSchema } from '@/validation/Schema';
import { AuthService } from '@/module/iam/service/AuthService';
import { Token } from '@/module/iam/type/Token';
import { CreateDeliveryEventData, DeliveryEvent } from '@/module/delivery/entity/DeliveryEvent';
import {
	DELIVERY_EVENT_RESOURCE,
	DeliveryEventResource,
	ORDER_RESOURCE,
	makeDeliveryEventResource,
} from '@/module/delivery/dto/Resource';
import { CreateDeliveryEventSchema } from '@/module/delivery/validation/Schema';
import {
	ORDER_REPOSITORY_PROVIDER,
	OrderRepository,
} from '@/module/delivery/service/OrderRepository';

@Controller('event')
export class DeliveryEventController {
	constructor(
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
			throw new ResourceNotFound({
				resource_type: ORDER_RESOURCE,
				key: 'id:' + data.order_id,
				path: '.order_id',
			});
		}

		const event = DeliveryEvent.create(data, user.id);
		order.updateStatus(event.status);

		await this.orderRepository.insertEvent(event, order);

		return makeDeliveryEventResource(event);
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	public async get(
		@ReqHeader('authorization', AccessTokenPipe) token: Token<string>,
		@Param('id', new SchemaPipe(UlidSchema)) id: string
	): Promise<DeliveryEventResource> {
		const user = await this.authService.getAuthenticatedUser(token);

		const event = await this.orderRepository.findEvent(id);
		if (!event || event.creatorId !== user.id) {
			throw new ResourceNotFound({
				resource_type: DELIVERY_EVENT_RESOURCE,
				key: 'id:' + id,
				path: null,
			});
		}

		return makeDeliveryEventResource(event);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	public async list(
		@ReqHeader('authorization', AccessTokenPipe) token: Token<string>
	): Promise<Array<DeliveryEventResource>> {
		const user = await this.authService.getAuthenticatedUser(token);
		return this.orderRepository.queryEvents({ creator_id: user.id });
	}
}
