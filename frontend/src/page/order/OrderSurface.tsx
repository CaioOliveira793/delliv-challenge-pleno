import { Link, useLoaderData } from 'react-router-dom';
import OrderDisplay, { Order } from '@/component/order/OrderDisplay';
import { AppPath } from '@/config/router';
import DeliveryEventDisplay, {
	DeliveryEvent,
} from '@/component/delivery_event/DeliveryEventDisplay';

export default function OrderSurface() {
	// const { id } = useParams();
	const order = useLoaderData() as Order | null;
	const events: Array<DeliveryEvent> = [];

	return order ? (
		<main id="order-surface">
			<div>
				<h3>{'Pedido #' + order.id}</h3>
			</div>

			<OrderDisplay order={order} show_id={false} />
			<button>Atualizar</button>

			<section id="history">
				<h4>Histórico</h4>

				<div>
					{events.map(event => (
						<DeliveryEventDisplay event={event} />
					))}
				</div>
			</section>
		</main>
	) : (
		<main>
			<div className="ContainerStyle.content_not_found">
				<h1 className="TypographyStyle.heading3">Pedido não encontrado</h1>
				<p className="TypographyStyle.body2">
					Verifique sua URL ou volte para os <Link to={AppPath.Order}>pedidos</Link>.
				</p>
			</div>
		</main>
	);
}
