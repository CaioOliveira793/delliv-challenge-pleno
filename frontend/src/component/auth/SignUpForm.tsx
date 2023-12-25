import Form, { BaseFormProps } from '@/component/form/Form';
import TextInput from '@/component/form/TextInput';

interface SignUpFormProps extends BaseFormProps {}

export default function SignUpForm({ children, ...props }: SignUpFormProps) {
	return (
		<Form id="signup-form" {...props} formAction={children}>
			<TextInput label="Nome" type="text" inputMode="text" autoComplete="name" required fullwidth />
			<TextInput
				label="E-mail"
				type="email"
				inputMode="email"
				autoComplete="email"
				required
				fullwidth
			/>
			<TextInput label="Senha" type="password" autoComplete="new-password" required fullwidth />
		</Form>
	);
}
