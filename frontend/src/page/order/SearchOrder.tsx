import OrderDisplay, { Order } from '@/component/order/OrderDisplay';

export default function SearchOrder() {
	const orders: Array<Order> = [];

	return (
		<main id="search-order">
			<div>
				<h3>Pedidos</h3>
			</div>

			<form id="search-order-form">
				{/* <TextField placeholder="Status" /> */}
				<button>Buscar</button>
			</form>

			<div>
				{orders.map(order => (
					<OrderDisplay order={order} />
				))}
			</div>
		</main>
	);
}
