import Logo from '@/component/app/Logo';
import Button from '@/component/form/Button';
import TypographyStyle from '@/style/typography.module.css';
import TopBarStyle from './TopBar.module.css';
import { useUserAccountUnwraped } from '@/hook/useUserAccount';

export default function TopBar() {
	const state = useUserAccountUnwraped();

	return state ? (
		<div className={TopBarStyle.container}>
			<Logo />
			<div className={TopBarStyle.user_container}>
				<p className={TypographyStyle.body2}>{state.user.name}</p>
				<hr />
				<Button variant="outlined">SignOut</Button>
			</div>
		</div>
	) : null;
}
