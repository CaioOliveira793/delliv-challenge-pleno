import { Link } from 'react-router-dom';
import { AppPath } from '@/config/router';
import { buttonClass } from '@/component/form/ButtonHelper';
import TopNavbarStyle from '@/component/app/TopNavbar/TopNavbar.module.css';

export default function TopNavbar() {
	return (
		<nav className={TopNavbarStyle.container}>
			<ul className={TopNavbarStyle.nav_item_list}>
				<li>
					<Link to={AppPath.SignIn} className={buttonClass({ variant: 'outlined', size: 'large' })}>
						Entrar
					</Link>
				</li>
				<li>
					<Link
						to={AppPath.SignUp}
						className={buttonClass({ variant: 'contained', size: 'large' })}
					>
						Criar conta
					</Link>
				</li>
			</ul>
		</nav>
	);
}
