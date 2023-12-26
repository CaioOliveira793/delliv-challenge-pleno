import { useContext, useState } from 'react';
import OrderDisplay from '@/component/order/OrderDisplay';
import OrderSearchForm from '@/component/order/OrderSearchForm';
import TopBar from '@/component/app/TopBar';
import ContainerStyle from '@/style/util/container.module.css';
import TypographyStyle from '@/style/typography.module.css';
import SearchOrderStyle from '@/style/page/order/SearchOrder.module.css';
import { classes } from '@/style/helper';
import { Order, OrderQuery } from '@/service/Resource';
import { FormError } from '@/hook/useForm';
import { APIContext } from '@/context/APIContext';
import { useUserAccountUnwraped } from '@/hook/useUserAccount';
import { handleListOrderError } from '@/error/OrderErrorHandler';
import { ResponseType } from '@/service/common';

const INITIAL_ORDER_QUERY: OrderQuery = { status: '' };

export default function SearchOrder() {
	const api = useContext(APIContext);
	const userAccount = useUserAccountUnwraped();
	const [orders, setOrders] = useState<Array<Order>>([]);

	async function searchOrders(query: OrderQuery): Promise<FormError<OrderQuery>[] | void> {
		if (!userAccount.state) return;

		const result = await api.listOrder(query, userAccount.state.token);
		if (result.type !== ResponseType.OK) {
			return handleListOrderError(result, userAccount.signOut);
		}
		setOrders(result.value);
	}

	return (
		<main
			id="search-order"
			className={classes(ContainerStyle.main_content, SearchOrderStyle.container)}
		>
			<TopBar />
			<h3 className={TypographyStyle.heading3}>Pedidos</h3>
			<OrderSearchForm initial={INITIAL_ORDER_QUERY} onSearch={searchOrders} />
			<div className={SearchOrderStyle.order_list}>
				{orders.map(order => (
					<OrderDisplay key={order.id} order={order} />
				))}
			</div>
		</main>
	);
}
