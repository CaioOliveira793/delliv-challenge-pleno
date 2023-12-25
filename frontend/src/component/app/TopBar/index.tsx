import { User } from '@/service/Resource';
import Logo from '@/component/app/Logo';
import Button from '@/component/form/Button';
import TypographyStyle from '@/style/typography.module.css';
import TopBarStyle from './TopBar.module.css';

const FAKE_USER: User = {
	id: '123',
	created: new Date(),
	updated: new Date(),
	name: 'Caio Oliveira',
	email: 'caio.vsoliveira@gmail.com',
	last_authentication: new Date(),
};

export default function TopBar() {
	const user = FAKE_USER;
	return (
		<div className={TopBarStyle.container}>
			<Logo />
			<div className={TopBarStyle.user_container}>
				<p className={TypographyStyle.body2}>{user.name}</p>
				<hr />
				<Button variant="outlined">SignOut</Button>
			</div>
		</div>
	);
}
