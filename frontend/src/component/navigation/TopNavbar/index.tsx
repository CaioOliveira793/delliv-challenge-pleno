import { Link } from 'react-router-dom';
import { AppPath } from '@/config/router';
import TopNavbarStyle from './TopNavbar.module.css';

export default function TopNavbar() {
	return (
		<nav className={TopNavbarStyle.container}>
			<ul className={TopNavbarStyle.nav_item_list}>
				<li>
					<Link to={AppPath.SignIn}>Entrar</Link>
				</li>
				<li>
					<Link to={AppPath.SignUp}>Criar conta</Link>
				</li>
			</ul>
		</nav>
	);
}
