import { Link, useLoaderData } from 'react-router-dom';
import { AppPath } from '@/config/router';
import DeliveryEventDisplay from '@/component/delivery_event/DeliveryEventDisplay';
import OrderDisplay from '@/component/order/OrderDisplay';
import TopBar from '@/component/app/TopBar';
import Button from '@/component/form/Button';
import { classes } from '@/style/helper';
import ContainerStyle from '@/style/util/container.module.css';
import TypographyStyle from '@/style/typography.module.css';
import OrderSurfaceStyle from '@/style/page/order/OrderSurface.module.css';
import { DeliveryEvent, Order } from '@/service/Resource';

const FAKE_ORDER: Order = {
	id: '1',
	created: new Date(),
	updated: new Date('2023-12-29T16:56:34.470Z'),
	creator_id: '1',
	status: 'Entregue',
	customer_name: 'Yasmin Alana',
	delivery_address: 'Rua Artur de Barros, n 829, Aclimação, Uberlândia, MG',
};

const FAKE_DELIVERY_EVENT_1: DeliveryEvent = {
	id: '2',
	creator_id: '1',
	order_id: FAKE_ORDER.id,
	created: new Date(),
	status: 'Entregue',
	message: null,
};
const FAKE_DELIVERY_EVENT_2: DeliveryEvent = {
	id: '1',
	creator_id: '1',
	order_id: FAKE_ORDER.id,
	created: new Date(),
	status: 'Postado',
	message: 'Objeto postado pelo remetente',
};

export default function OrderSurface() {
	const order = (useLoaderData() as Order | null) ?? FAKE_ORDER;
	const events: Array<DeliveryEvent> = [FAKE_DELIVERY_EVENT_1, FAKE_DELIVERY_EVENT_2];

	return order ? (
		<main
			id="order-surface"
			className={classes(ContainerStyle.main_content, OrderSurfaceStyle.container)}
		>
			<TopBar />
			<h3 className={TypographyStyle.heading3}>{'Pedido #' + order.id}</h3>
			<OrderDisplay order={order} show_id={false} />
			<Button color="info" className={OrderSurfaceStyle.update_button}>
				Atualizar
			</Button>

			<section id="history" className={OrderSurfaceStyle.event_history_section}>
				<h4 className={TypographyStyle.heading4}>Histórico</h4>

				<div className={OrderSurfaceStyle.event_list}>
					{events.map(event => (
						<DeliveryEventDisplay key={event.id} event={event} />
					))}
				</div>
			</section>
		</main>
	) : (
		<main className={ContainerStyle.main_content}>
			<div className={ContainerStyle.content_not_found}>
				<h1 className={TypographyStyle.heading3}>Pedido não encontrado</h1>
				<p className={TypographyStyle.body2}>
					Verifique sua URL ou volte para os <Link to={AppPath.Order}>pedidos</Link>.
				</p>
			</div>
		</main>
	);
}
