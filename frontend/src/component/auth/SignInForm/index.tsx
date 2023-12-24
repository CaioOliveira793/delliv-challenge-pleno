import { FormHTMLAttributes, ReactNode } from 'react';
import ErrorMessageList from '@/component/form/ErrorMessageList';
import { classes } from '@/style/helper';
import FormStyle from '@/style/form/form.module.css';

interface SignInFormProps extends FormHTMLAttributes<HTMLFormElement> {
	formErrors?: string[];

	header?: ReactNode;
	footer?: ReactNode;
}

export default function SignInForm({
	formErrors = [],
	header,
	footer,
	children,
	className,
}: SignInFormProps) {
	return (
		<form id="signin-form" className={classes(FormStyle.form, className)}>
			{header ? <div className={FormStyle.form_header}>{header}</div> : null}

			{/* <TextInput
				label="E-mail"
				type="email"
				inputmode="email"
				autocomplete="email"
				required
				fullwidth
			/> */}
			{/* <TextInput label="Senha" type="password" autocomplete="current-password" required fullwidth /> */}

			{formErrors.length !== 0 ? <ErrorMessageList errors={formErrors} /> : null}

			{footer ? (
				<div className={FormStyle.form_footer}>
					{footer}
					<div className={FormStyle.form_action}>{children}</div>
				</div>
			) : null}
		</form>
	);
}
