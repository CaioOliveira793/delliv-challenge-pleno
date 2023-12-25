import { useRouteError, ErrorResponse, Link } from 'react-router-dom';
import { AppPath } from '@/config/router';
import ContainerStyle from '@/style/util/container.module.css';
import TypographyStyle from '@/style/typography.module.css';
import ErrorSurfaceStyle from '@/style/page/ErrorSurface.module.css';
import { classes } from '@/style/helper';

export default function ErrorSurface() {
	const error = useRouteError() as ErrorResponse & Error;
	console.error(error);

	return (
		<main
			id="error-page"
			className={classes(ErrorSurfaceStyle.container, ContainerStyle.main_content)}
		>
			<h1 className={TypographyStyle.heading1}>Oops!</h1>
			<p className={TypographyStyle.body2}>Desculpe, um erro inesperado ocorreu.</p>
			<p className={classes(ErrorSurfaceStyle.error_paragraph, TypographyStyle.caption)}>
				<i>{error?.statusText || error.message}</i>
			</p>
			<p className={TypographyStyle.body2}>
				Voltar para <Link to={AppPath.Root}>página inicial</Link>
			</p>
		</main>
	);
}
