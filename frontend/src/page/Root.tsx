import { AppPath } from '@/config/router';
import { Link } from 'react-router-dom';

export default function Root() {
	return (
		<main id="root">
			<nav>
				<ul>
					<li>
						<Link to={AppPath.SignIn}>Entrar</Link>
					</li>
					<li>
						<Link to={AppPath.SignUp}>Criar conta</Link>
					</li>
				</ul>
			</nav>

			<div>
				<h1>Order Tracker</h1>
				<p>Seu app de rastreamento de pedidos.</p>
			</div>

			<section id="example-interface">
				<div>TODO: example interface 1</div>

				<div>TODO: example interface 2</div>
			</section>
		</main>
	);
}
