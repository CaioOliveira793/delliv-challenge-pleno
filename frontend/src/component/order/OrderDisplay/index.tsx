import { Link } from 'react-router-dom';
import { AppPath } from '@/config/router';
import { formatTimeMetadata } from '@/formatter/DateTimeFormatter';
import TypographyStyle from '@/style/typography.module.css';
import OrderDisplayStyle from './OrderDisplay.module.css';

export interface Order {
	id: string;
	created: Date;
	updated: Date;
	status: string;
	customer_name: string;
	delivery_address: string;
}

interface OrderDisplayProps {
	order: Order;
	show_id?: boolean;
}

export default function OrderDisplay({ order, show_id = true }: OrderDisplayProps) {
	return (
		<div className={OrderDisplayStyle.container}>
			{show_id ? (
				<Link to={AppPath.Order + '/' + order.id} className={OrderDisplayStyle.order_link}>
					{'#' + order.id}
				</Link>
			) : null}
			<p>
				<span className={TypographyStyle.attr_name}>Status: </span>
				<span className={TypographyStyle.attr_value}>{order.status}</span>
			</p>
			<p>
				<span className={TypographyStyle.attr_name}>Cliente: </span>
				<span className={TypographyStyle.attr_value}>{order.customer_name}</span>
			</p>
			<p>
				<span className={TypographyStyle.attr_name}>Endereço de entrega: </span>
				<span className={TypographyStyle.attr_value}>{order.delivery_address}</span>
			</p>
			<p className={TypographyStyle.caption}>{formatTimeMetadata(order.created, order.updated)}</p>
		</div>
	);
}
