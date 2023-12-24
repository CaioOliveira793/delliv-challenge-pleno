import OrderItem, { Order } from '@/component/order/OrderItem';

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
					<OrderItem order={order} />
				))}
			</div>
		</main>
	);
}
