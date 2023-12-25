import OrderDisplay, { Order } from '@/component/order/OrderDisplay';
import OrderSearchForm from '@/component/order/OrderSearchForm';
import TopBar from '@/component/app/TopBar';
import ContainerStyle from '@/style/util/container.module.css';
import TypographyStyle from '@/style/typography.module.css';
import SearchOrderStyle from '@/style/page/order/SearchOrder.module.css';
import { classes } from '@/style/helper';

export default function SearchOrder() {
	const orders: Array<Order> = [];

	return (
		<main
			id="search-order"
			className={classes(ContainerStyle.main_content, SearchOrderStyle.container)}
		>
			<TopBar />

			<div>
				<h3 className={TypographyStyle.heading3}>Pedidos</h3>
			</div>

			<OrderSearchForm />

			<div>
				{orders.map(order => (
					<OrderDisplay order={order} />
				))}
			</div>
		</main>
	);
}
