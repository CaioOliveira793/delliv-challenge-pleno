import { Link } from 'react-router-dom';
import { AppPath } from '@/config/router';
import { buttonClass } from '@/component/form/ButtonHelper';
import SignInForm from '@/component/auth/SignInForm';
import TypographyStyle from '@/style/typography.module.css';
import ContainerStyle from '@/style/util/container.module.css';
import SignInStyle from '@/style/page/auth/SignIn.module.css';
import Button from '@/component/form/Button';

export default function SignIn() {
	return (
		<main id="signin" className={ContainerStyle.main_content}>
			<div className={SignInStyle.top_container}>
				<p className={TypographyStyle.body2}>Ainda não possui uma conta?</p>
				<Link
					to={AppPath.SignUp}
					className={buttonClass({ variant: 'outlined', size: 'large', color: 'primary' })}
				>
					Criar conta
				</Link>
			</div>

			<SignInForm
				className={SignInStyle.signin_form}
				header={<p className={TypographyStyle.subtitle}>Sign-In</p>}
			>
				<Button>Entrar</Button>
			</SignInForm>
		</main>
	);
}
