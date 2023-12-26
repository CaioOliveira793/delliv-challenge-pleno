import { FORM_ERROR_FIELD, useForm, OnSubmit, OnChange, mapFilterErrorField } from '@/hook/useForm';
import Form, { BaseFormProps } from '@/component/form/Form';
import TextInput from '@/component/form/TextInput';
import type { UserCredential } from '@/service/Resource';

interface SignInFormProps extends Omit<BaseFormProps, 'onSubmit' | 'onChange'> {
	initial?: UserCredential;
	onSingIn?: OnSubmit<UserCredential>;
	onChange?: OnChange<UserCredential>;
}

export default function SignInForm({
	children,
	initial,
	onSingIn,
	onChange,
	...props
}: SignInFormProps) {
	const { errors, handleChange, handleSubmit } = useForm({
		initial,
		onSubmit: onSingIn,
		onChange,
	});

	return (
		<Form
			id="signin-form"
			formAction={children}
			errors={mapFilterErrorField(errors, FORM_ERROR_FIELD)}
			onSubmit={handleSubmit}
			{...props}
		>
			<TextInput
				name="email"
				label="E-mail"
				type="email"
				inputMode="email"
				autoComplete="email"
				required
				fullwidth
				errors={mapFilterErrorField(errors, 'email')}
				onChange={handleChange}
			/>
			<TextInput
				name="password"
				label="Senha"
				type="password"
				autoComplete="current-password"
				required
				fullwidth
				errors={mapFilterErrorField(errors, 'password')}
				onChange={handleChange}
			/>
		</Form>
	);
}
