import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { ReqHeader } from '@/decorator/ReqHeader';
import { SchemaPipe } from '@/pipe/SchemaPipe';
import { AccessTokenPipe } from '@/pipe/AccessTokenPipe';
import { AuthService } from '@/module/iam/service/AuthService';
import { Token } from '@/module/iam/type/Token';
import { ORDER_REPOSITORY_PROVIDER, OrderRepository } from '@/module/order/service/OrderRepository';
import { CreateOrderData, Order } from '@/module/order/entity/Order';
import { CreateOrderSchema } from '@/module/order/validation/Schema';
import { OrderResource, makeOrderResource } from '@/module/order/dto/Resource';
import { UlidSchema } from '@/validation/Schema';
import { ResourceNotFound } from '@/exception/resource/ResourceNotFound';

@Controller('order')
export class OrderController {
	constructor(
		@Inject(ORDER_REPOSITORY_PROVIDER)
		private readonly orderRepository: OrderRepository,
		private readonly authService: AuthService
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	public async create(
		@ReqHeader('authorization', AccessTokenPipe) token: Token<string>,
		@Body(new SchemaPipe(CreateOrderSchema)) data: CreateOrderData
	): Promise<OrderResource> {
		const user = await this.authService.getAuthenticatedUser(token);

		const order = Order.create(data, user.id);
		await this.orderRepository.insert(order);

		return makeOrderResource(order);
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	public async get(
		@ReqHeader('authorization', AccessTokenPipe) token: Token<string>,
		@Param('id', new SchemaPipe(UlidSchema)) id: string
	): Promise<OrderResource> {
		const user = await this.authService.getAuthenticatedUser(token);

		const order = await this.orderRepository.find(id);
		if (!order || order.creatorId !== user.id) {
			throw new ResourceNotFound('Order not found', {
				resource_type: 'ORDER',
				key: 'id:' + id,
				path: null,
			});
		}

		return makeOrderResource(order);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	public async list(
		@ReqHeader('authorization', AccessTokenPipe) token: Token<string>
	): Promise<Array<OrderResource>> {
		const user = await this.authService.getAuthenticatedUser(token);
		return this.orderRepository.query({ creator_id: user.id });
	}
}
