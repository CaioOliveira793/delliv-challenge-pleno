import { Link } from 'react-router-dom';
import { AppPath } from '@/config/router';

export default function SignUp() {
	return (
		<main id="signup">
			<div>
				<p>Já possui uma conta?</p>
				<Link to={AppPath.SignIn}>Entrar</Link>
			</div>

			<form id="signup-form">
				<p>Sign-Up</p>
				{/* <TextField label="Nome" /> */}
				{/* <TextField label="E-mail" /> */}
				{/* <TextField label="Senha" /> */}
				<button type="submit">Criar</button>
			</form>
		</main>
	);
}
