import { nanoid } from 'nanoid';
import { HTMLAttributes, ReactNode } from 'react';
import InputLabel, { InputLabelStrictProps } from '@/component/form/InputLabel';
import ErrorList from '@/component/form/ErrorList';
import Input, { InputProps } from '@/component/form/Input';
import TypographyStyle from '@/style/typography.module.css';
import InputStyle from '@/style/form/input.module.css';
import { classes } from '@/style/helper';

export interface TextInputProps extends InputLabelStrictProps, InputProps {
	errors?: string[];

	description?: ReactNode;
	helperText?: ReactNode;

	wrapperProps?: HTMLAttributes<HTMLDivElement>;
	inputWrapperProps?: HTMLAttributes<HTMLDivElement>;
}

export default function TextInput({
	asterisk,
	label,
	id,
	required,
	errors,
	fullwidth,
	description,
	helperText,
	wrapperProps,
	inputWrapperProps,
	...inputProps
}: TextInputProps) {
	const theID = id ?? nanoid();
	return (
		<div
			data-style-fullwidth={fullwidth ? '' : null}
			{...wrapperProps}
			className={classes(InputStyle.input_wrapper, wrapperProps?.className)}
		>
			{label ? <InputLabel htmlFor={theID} label={label} asterisk={asterisk || required} /> : null}
			{description ? <p className={TypographyStyle.helper_text}>{description}</p> : null}
			<Input
				id={theID}
				required={required}
				fullwidth={fullwidth}
				wrapperProps={inputWrapperProps}
				{...inputProps}
			></Input>
			{helperText ? <p className={TypographyStyle.helper_text}>{helperText}</p> : null}
			{errors?.length != 0 ? (
				<ErrorList errors={errors} role="alert" className={TypographyStyle.error_message} />
			) : null}
		</div>
	);
}
