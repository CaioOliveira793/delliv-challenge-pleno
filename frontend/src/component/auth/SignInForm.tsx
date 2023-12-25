import Form, { BaseFormProps } from '@/component/form/Form';
import TextInput from '@/component/form/TextInput';

interface SignInFormProps extends BaseFormProps {}

export default function SignInForm({ children, ...props }: SignInFormProps) {
	return (
		<Form id="signin-form" {...props} formAction={children}>
			<TextInput
				label="E-mail"
				type="email"
				inputMode="email"
				autoComplete="email"
				required
				fullwidth
			/>
			<TextInput label="Senha" type="password" autoComplete="current-password" required fullwidth />
		</Form>
	);
}
