import { Link } from 'react-router-dom';
import { AppPath } from '@/config/router';
import { classes } from '@/style/helper';
import TypographyStyle from '@/style/typography.module.css';
import ContainerStyle from '@/style/util/container.module.css';
import NotFoundStyle from '@/style/page/NotFound.module.css';

export default function NotFound() {
	const isUserAuthenticated = false;
	return (
		<main id="not-found" className={classes(ContainerStyle.main_content, NotFoundStyle.container)}>
			<h1 className={TypographyStyle.heading3}>Esta página não existe</h1>
			{isUserAuthenticated ? (
				<p className={TypographyStyle.body2}>
					Verifique sua URL ou volte para a <Link to={AppPath.Order}>página inicial</Link>.
				</p>
			) : (
				<p className={TypographyStyle.body2}>
					Verifique sua URL ou volte para a <Link to={AppPath.SignIn}>página de sign-in</Link>.
				</p>
			)}
		</main>
	);
}
