import { Link } from 'react-router-dom';
import { AppPath } from '@/config/router';

export interface Order {
	id: string;
	created: Date;
	updated: Date;
	status: string;
	customer_name: string;
	delivery_address: string;
}

interface OrderItemParams {
	order: Order;
}

export default function OrderItem({ order }: OrderItemParams) {
	return (
		<div>
			<Link to={AppPath.Order + '/' + order.id}>{'#' + order.id}</Link>
			<p>Status: {order.status}</p>
			<div>
				<p>Cliente: {order.customer_name}</p>
				<p>Endereço de entrega: {order.delivery_address}</p>
			</div>
		</div>
	);
}
