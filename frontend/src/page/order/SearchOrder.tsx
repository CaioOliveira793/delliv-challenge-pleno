import OrderDisplay from '@/component/order/OrderDisplay';
import OrderSearchForm from '@/component/order/OrderSearchForm';
import TopBar from '@/component/app/TopBar';
import ContainerStyle from '@/style/util/container.module.css';
import TypographyStyle from '@/style/typography.module.css';
import SearchOrderStyle from '@/style/page/order/SearchOrder.module.css';
import { classes } from '@/style/helper';
import { Order } from '@/service/Resource';

const FAKE_ORDER: Order = {
	id: '1',
	created: new Date(),
	updated: new Date(),
	creator_id: '1',
	status: 'Entregue',
	customer_name: 'Yasmin Alana',
	delivery_address: 'Rua Artur de Barros, n 829, Aclimação, Uberlândia, MG',
};

export default function SearchOrder() {
	const orders: Array<Order> = [FAKE_ORDER];

	return (
		<main
			id="search-order"
			className={classes(ContainerStyle.main_content, SearchOrderStyle.container)}
		>
			<TopBar />
			<h3 className={TypographyStyle.heading3}>Pedidos</h3>
			<OrderSearchForm />
			<div className={SearchOrderStyle.order_list}>
				{orders.map(order => (
					<OrderDisplay key={order.id} order={order} />
				))}
			</div>
		</main>
	);
}
