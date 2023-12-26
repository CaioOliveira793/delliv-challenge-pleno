import { AppPath } from '@/config/router';
import TopSignAction from '@/component/auth/TopSignAction';
import SignUpForm from '@/component/auth/SignUpForm';
import Button from '@/component/form/Button';
import TypographyStyle from '@/style/typography.module.css';
import ContainerStyle from '@/style/util/container.module.css';
import SignStyle from '@/style/page/Sign.module.css';
import { CreateUserData } from '@/service/Resource';
import { useUserAccount } from '@/hook/useUserAccount';
import { ResponseType } from '@/service/common';
import { handleCreateUserError } from '@/error/UserErrorHandler';
import { useSignedUserNavigation } from '@/hook/useSignedUserNavigation';

const INITIAL_CREATE_USER_DATA: CreateUserData = { name: '', email: '', password: '' };

export default function SignUp() {
	const userAccount = useUserAccount();
	const signInNavigate = useSignedUserNavigation();

	async function signUpUser(data: CreateUserData) {
		const response = await userAccount.createUser(data);
		if (response.type !== ResponseType.CREATED) {
			return handleCreateUserError(response, userAccount.signOut);
		}

		signInNavigate();
	}

	return (
		<main id="signup" className={ContainerStyle.main_content}>
			<TopSignAction actionText="Já possui uma conta?" linkTo={AppPath.SignIn}>
				Entrar
			</TopSignAction>

			<SignUpForm
				className={SignStyle.sign_form}
				header={<p className={TypographyStyle.subtitle}>Sign-Up</p>}
				initial={INITIAL_CREATE_USER_DATA}
				onSingUp={signUpUser}
			>
				<Button type="submit">Criar</Button>
			</SignUpForm>
		</main>
	);
}
