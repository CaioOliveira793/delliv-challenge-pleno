import { AppPath } from '@/config/router';
import TopSignAction from '@/component/auth/TopSignAction';
import SignUpForm from '@/component/auth/SignUpForm';
import Button from '@/component/form/Button';
import TypographyStyle from '@/style/typography.module.css';
import ContainerStyle from '@/style/util/container.module.css';
import SignStyle from '@/style/page/Sign.module.css';

export default function SignUp() {
	return (
		<main id="signup" className={ContainerStyle.main_content}>
			<TopSignAction actionText="Já possui uma conta?" linkTo={AppPath.SignIn}>
				Entrar
			</TopSignAction>

			<SignUpForm
				className={SignStyle.sign_form}
				header={<p className={TypographyStyle.subtitle}>Sign-Up</p>}
			>
				<Button type="submit">Criar</Button>
			</SignUpForm>
		</main>
	);
}
