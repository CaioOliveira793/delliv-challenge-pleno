import { AppPath } from '@/config/router';
import { Link } from 'react-router-dom';

export default function NotFound() {
	const isUserAuthenticated = false;
	return (
		<main id="not-found-page" className="ContainerStyle.content_not_found">
			<h1 className="TypographyStyle.heading3">Esta página não existe</h1>
			{isUserAuthenticated ? (
				<p>
					Verifique sua URL ou volte para a<Link to={AppPath.Order}>página inicial</Link>.
				</p>
			) : (
				<p>
					Verifique sua URL ou volte para a<Link to={AppPath.SignIn}>página de sign-in</Link>.
				</p>
			)}
		</main>
	);
}
