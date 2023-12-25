import { AppPath } from '@/config/router';
import SignInForm from '@/component/auth/SignInForm';
import Button from '@/component/form/Button';
import TopSignAction from '@/component/auth/TopSignAction';
import TypographyStyle from '@/style/typography.module.css';
import ContainerStyle from '@/style/util/container.module.css';
import SignInStyle from '@/style/page/auth/SignIn.module.css';

export default function SignIn() {
	return (
		<main id="signin" className={ContainerStyle.main_content}>
			<TopSignAction
				actionText="Ainda não possui uma conta?"
				linkTo={AppPath.SignUp}
				linkColor="info"
			>
				Criar conta
			</TopSignAction>

			<SignInForm
				className={SignInStyle.signin_form}
				header={<p className={TypographyStyle.subtitle}>Sign-In</p>}
			>
				<Button>Entrar</Button>
			</SignInForm>
		</main>
	);
}
