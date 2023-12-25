import { AppPath } from '@/config/router';
import SignInForm from '@/component/auth/SignInForm';
import Button from '@/component/form/Button';
import TopSignAction from '@/component/auth/TopSignAction';
import TypographyStyle from '@/style/typography.module.css';
import ContainerStyle from '@/style/util/container.module.css';
import SignStyle from '@/style/page/Sign.module.css';
import { UserCredential } from '@/service/Resource';

const INITIAL_USER_CREDENTIAL: UserCredential = { email: '', password: '' };

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
				className={SignStyle.sign_form}
				header={<p className={TypographyStyle.subtitle}>Sign-In</p>}
				initial={INITIAL_USER_CREDENTIAL}
				onChange={(data, errors) => console.log(data, errors)}
			>
				<Button type="submit">Entrar</Button>
			</SignInForm>
		</main>
	);
}
