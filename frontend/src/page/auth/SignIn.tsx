import { AppPath } from '@/config/router';
import { Link } from 'react-router-dom';

export default function SignIn() {
	return (
		<main id="signin">
			<div>
				<p>Ainda não possui uma conta?</p>
				<Link to={AppPath.SignUp}>Criar conta</Link>
			</div>

			<form id="signin-form">
				<p>Sign-In</p>
				{/* <TextField label="E-mail" /> */}
				{/* <TextField label="Senha" /> */}
				<button type="submit">Entrar</button>
			</form>
		</main>
	);
}
