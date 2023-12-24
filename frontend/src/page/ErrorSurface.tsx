import { useRouteError, ErrorResponse } from 'react-router-dom';

export default function ErrorSurface() {
	const error = useRouteError() as ErrorResponse & Error;
	console.error(error);

	return (
		<main id="error-page">
			<h1>Oops!</h1>
			<p>Desculpe, um erro inesperado ocorreu.</p>
			<p>
				<i>{error?.statusText || error.message}</i>
			</p>
			{/* TODO: go back to the main page */}
		</main>
	);
}
