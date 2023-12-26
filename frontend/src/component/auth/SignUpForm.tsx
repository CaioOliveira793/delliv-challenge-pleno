import { FORM_ERROR_FIELD, OnChange, OnSubmit, mapFilterErrorField, useForm } from '@/hook/useForm';
import Form, { BaseFormProps } from '@/component/form/Form';
import TextInput from '@/component/form/TextInput';
import type { CreateUserData } from '@/service/Resource';

interface SignUpFormProps extends Omit<BaseFormProps, 'onSubmit' | 'onChange'> {
	initial?: CreateUserData;
	onSingUp?: OnSubmit<CreateUserData>;
	onChange?: OnChange<CreateUserData>;
}

export default function SignUpForm({
	children,
	initial,
	onSingUp,
	onChange,
	...props
}: SignUpFormProps) {
	const { errors, handleChange, handleSubmit } = useForm({
		initial,
		onSubmit: onSingUp,
		onChange,
	});

	return (
		<Form
			id="signup-form"
			formAction={children}
			errors={mapFilterErrorField(errors, FORM_ERROR_FIELD)}
			onSubmit={handleSubmit}
			{...props}
		>
			<TextInput
				name="name"
				label="Nome"
				type="text"
				inputMode="text"
				autoComplete="name"
				required
				fullwidth
				errors={mapFilterErrorField(errors, 'name')}
				onChange={handleChange}
			/>
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
				autoComplete="new-password"
				required
				fullwidth
				errors={mapFilterErrorField(errors, 'password')}
				onChange={handleChange}
			/>
		</Form>
	);
}
