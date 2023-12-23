import { ulid } from 'ulid';
import { ResourceNotFound } from '@/exception/resource/ResourceNotFound';
import { OrderMemRepository } from '@/module/delivery/service/impl/OrderMemRepository';
import { fakeOrder } from '@/module/delivery/entity/Order.fake';
import { fakeDeliveryEvent } from '@/module/delivery/entity/DeliveryEvent.fake';
import { ORDER_RESOURCE } from '@/module/delivery/dto/Resource';

describe('OrderMemRepository', () => {
	describe('OrderMemRepository order methods', () => {
		it('insert a new order into the repository', async () => {
			const repository = new OrderMemRepository();

			const order = fakeOrder();
			await repository.insert(order);

			const insertedOrder = await repository.find(order.id);

			expect(insertedOrder).not.toStrictEqual(null);
			expect(insertedOrder!.internalState()).toStrictEqual(order.internalState());
		});

		it('throw an error when insert an order with a id already in the repository', async () => {
			const commonID = ulid();
			const repository = new OrderMemRepository();

			await repository.insert(fakeOrder({}, commonID));

			await expect(() => repository.insert(fakeOrder({}, commonID))).rejects.toThrow(
				new Error(OrderMemRepository.ORDER_UNIQUE_ID_MESSAGE)
			);
		});

		it('find an order by the id in the repository', async () => {
			const order = fakeOrder();
			const repository = new OrderMemRepository();

			await repository.insert(order);
			const orderFound = await repository.find(order.id);

			expect(orderFound).not.toStrictEqual(null);
			expect(orderFound!.id).toStrictEqual(order.id);
			expect(orderFound!.internalState()).toStrictEqual(order.internalState());
		});

		it('not find an order by the id when is not present in the repository', async () => {
			const order = fakeOrder();
			const repository = new OrderMemRepository();

			const orderFound = await repository.find(order.id);

			expect(orderFound).toStrictEqual(null);
		});

		it('update an order in the repository', async () => {
			const order = fakeOrder();
			const repository = new OrderMemRepository();

			await repository.insert(order);

			order.updateStatus('entregue');
			await repository.update(order);

			const updatedOrder = await repository.find(order.id);
			expect(updatedOrder).not.toStrictEqual(null);
			expect(updatedOrder!.internalState()).toStrictEqual(order.internalState());
		});

		it('throw an error updating an order when the order is not present in the repository', async () => {
			const order = fakeOrder();
			const repository = new OrderMemRepository();

			await expect(() => repository.update(order)).rejects.toThrow(
				new ResourceNotFound({
					resource_type: ORDER_RESOURCE,
					key: 'id:' + order.id,
					path: null,
				})
			);
		});
	});

	describe('OrderMemRepository delivery event methods', () => {
		it('insert a new delivery event and update the order state', async () => {
			const order = fakeOrder();
			const repository = new OrderMemRepository();

			repository.insert(order);

			const event = fakeDeliveryEvent({ orderId: order.id });
			order.updateStatus(event.status);
			await repository.insertEvent(event, order);

			const insertedEvent = await repository.findEvent(event.id);

			expect(insertedEvent).not.toStrictEqual(null);
			expect(insertedEvent!.internalState()).toStrictEqual(event.internalState());

			const udpatedOrder = await repository.find(order.id);

			expect(udpatedOrder).not.toStrictEqual(null);
			expect(udpatedOrder!.internalState()).toStrictEqual(order.internalState());
		});

		it('throw an error inserting a new delivery event with the same id already in the repository', async () => {
			const order = fakeOrder();
			const repository = new OrderMemRepository();

			repository.insert(order);

			const event = fakeDeliveryEvent({ orderId: order.id });
			order.updateStatus(event.status);
			await repository.insertEvent(event, order);

			const newEvent = fakeDeliveryEvent({ orderId: order.id }, event.id);

			await expect(() => repository.insertEvent(newEvent, order)).rejects.toThrow(
				new Error(OrderMemRepository.DELIVERY_EVENT_UNIQUE_ID_MESSAGE)
			);
		});

		it('throw an error inserting a new delivery event when the order is not present in the repository', async () => {
			const order = fakeOrder();
			const repository = new OrderMemRepository();

			const event = fakeDeliveryEvent({ orderId: order.id });
			order.updateStatus(event.status);

			await expect(() => repository.insertEvent(event, order)).rejects.toThrow(
				new ResourceNotFound({
					key: 'id:' + order.id,
					path: null,
					resource_type: ORDER_RESOURCE,
				})
			);
		});

		it('find a delivery event by the id in the repository', async () => {
			const order = fakeOrder();
			const repository = new OrderMemRepository();

			await repository.insert(order);

			const event = fakeDeliveryEvent({ orderId: order.id });
			order.updateStatus(event.status);
			await repository.insertEvent(event, order);

			const eventFound = await repository.findEvent(event.id);

			expect(eventFound).not.toStrictEqual(null);
			expect(eventFound!.id).toStrictEqual(event.id);
			expect(eventFound!.internalState()).toStrictEqual(event.internalState());
		});

		it('not find a delivery event by the id when is not present in the repository', async () => {
			const event = fakeDeliveryEvent();
			const repository = new OrderMemRepository();

			const eventFound = await repository.findEvent(event.id);

			expect(eventFound).toStrictEqual(null);
		});
	});

	describe('OrderMemRepository order query methods', () => {
		it('query orders sorting the result in descending order by the "created" field', async () => {
			const repository = new OrderMemRepository();
			const orders = new Array(50).fill(null).map(() => fakeOrder());

			for (const order of orders) {
				await repository.insert(order);
			}

			const expectedIDs = orders
				// ORBDER BY created DESC
				.sort((a, b) => b.created.getTime() - a.created.getTime())
				.map(o => o.id);

			const result = await repository.query({});

			expect(result.map(resource => resource.id)).toStrictEqual(expectedIDs);
		});

		it('query orders filtering by the "creator_id" field', async () => {
			const repository = new OrderMemRepository();
			const creator = ulid();
			const orders = new Array(50)
				.fill(null)
				.map(() => (Math.random() > 0.5 ? fakeOrder({ creatorId: creator }) : fakeOrder()));

			for (const order of orders) {
				await repository.insert(order);
			}

			const expectedIDs = orders
				// ORBDER BY created DESC
				.sort((a, b) => b.created.getTime() - a.created.getTime())
				// WHERE order.creator_id == {creator}
				.filter(o => o.creatorId === creator)
				.map(o => o.id);

			const result = await repository.query({ creator_id: creator });

			expect(result.map(resource => resource.id)).toStrictEqual(expectedIDs);
		});
	});

	describe('OrderMemRepository delivery_event query methods', () => {
		it('query events sorting the result in descending order by the "created" field', async () => {
			const repository = new OrderMemRepository();
			const order = fakeOrder();
			const events = new Array(50).fill(null).map(() => fakeDeliveryEvent({ orderId: order.id }));

			await repository.insert(order);
			for (const event of events) {
				order.updateStatus(event.status);
				await repository.insertEvent(event, order);
			}

			const expectedIDs = events
				// ORBDER BY created DESC
				.sort((a, b) => b.created.getTime() - a.created.getTime())
				.map(o => o.id);

			const result = await repository.queryEvents({});

			expect(result.map(resource => resource.id)).toStrictEqual(expectedIDs);
		});

		it('query orders filtering by the "order_id" field', async () => {
			const repository = new OrderMemRepository();
			const order = fakeOrder();
			const events = new Array(50)
				.fill(null)
				.map(() =>
					Math.random() > 0.5 ? fakeDeliveryEvent({ orderId: order.id }) : fakeDeliveryEvent()
				);

			await repository.insert(order);
			for (const event of events) {
				order.updateStatus(event.status);
				await repository.insertEvent(event, order);
			}

			const expectedIDs = events
				// ORBDER BY created DESC
				.sort((a, b) => b.created.getTime() - a.created.getTime())
				// WHERE delivery_event.order_id == {order_id}
				.filter(e => e.orderId === order.id)
				.map(o => o.id);

			const result = await repository.queryEvents({ order_id: order.id });

			expect(result.map(resource => resource.id)).toStrictEqual(expectedIDs);
		});

		it('query orders filtering by the "creator_id" field', async () => {
			const repository = new OrderMemRepository();
			const creator = ulid();
			const order = fakeOrder();
			const events = new Array(50)
				.fill(null)
				.map(() =>
					Math.random() > 0.5 ? fakeDeliveryEvent({ creatorId: creator }) : fakeDeliveryEvent()
				);

			await repository.insert(order);
			for (const event of events) {
				order.updateStatus(event.status);
				await repository.insertEvent(event, order);
			}

			const expectedIDs = events
				// ORBDER BY created DESC
				.sort((a, b) => b.created.getTime() - a.created.getTime())
				// WHERE delivery_event.creator_id == {creator_id}
				.filter(e => e.creatorId === creator)
				.map(o => o.id);

			const result = await repository.queryEvents({ creator_id: creator });

			expect(result.map(resource => resource.id)).toStrictEqual(expectedIDs);
		});

		it('query orders filtering by the "creator_id" AND "order_id" field', async () => {
			const repository = new OrderMemRepository();
			const creator = ulid();
			const order = fakeOrder();
			const events = new Array(50)
				.fill(null)
				.map(() =>
					Math.random() > 0.5
						? fakeDeliveryEvent({ creatorId: creator, orderId: order.id })
						: fakeDeliveryEvent({ creatorId: creator })
				);

			await repository.insert(order);
			for (const event of events) {
				order.updateStatus(event.status);
				await repository.insertEvent(event, order);
			}

			const expectedIDs = events
				// ORBDER BY created DESC
				.sort((a, b) => b.created.getTime() - a.created.getTime())
				// WHERE delivery_event.order_id == {order_id}
				.filter(e => e.orderId === order.id)
				// WHERE delivery_event.creator_id == {creator_id}
				.filter(e => e.creatorId === creator)
				.map(o => o.id);

			const result = await repository.queryEvents({ creator_id: creator, order_id: order.id });

			expect(result.map(resource => resource.id)).toStrictEqual(expectedIDs);
		});
	});
});
