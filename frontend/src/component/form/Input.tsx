import { HTMLAttributes, HTMLInputTypeAttribute, InputHTMLAttributes, ReactNode } from 'react';
import Ring180 from '@/component/spinner/Ring180';
import { classes } from '@/style/helper';
import InputStyle from '@/style/form/input.module.css';

export type InputVariant = 'contained' | 'outlined';

function inputVariantClass(variant?: InputVariant): string {
	switch (variant) {
		case 'contained':
			return InputStyle.contained;
		case 'outlined':
			return InputStyle.outlined;
		default:
			return InputStyle.contained;
	}
}

export type InputSize = 'small' | 'medium' | 'large';

function inputSizeClass(size?: InputSize): string {
	switch (size) {
		case 'small':
			return InputStyle.small;
		case 'medium':
			return InputStyle.medium;
		case 'large':
			return InputStyle.large;
		default:
			return InputStyle.medium;
	}
}

export type InputColor = 'current' | 'primary' | 'info' | 'success' | 'warning' | 'error';

function inputColorClass(color?: InputColor): string {
	switch (color) {
		case 'current':
			return InputStyle.current;
		case 'primary':
			return InputStyle.primary;
		case 'info':
			return InputStyle.info;
		case 'success':
			return InputStyle.success;
		case 'warning':
			return InputStyle.warning;
		case 'error':
			return InputStyle.error;
		default:
			return InputStyle.primary;
	}
}

export interface InputStrictProps {
	type?: HTMLInputTypeAttribute;
	variant?: InputVariant;
	size?: InputSize;
	color?: InputColor;
	invalid?: boolean;
	focused?: boolean;
	disabled?: boolean;
	loading?: boolean;
	fullwidth?: boolean;

	startAdornment?: ReactNode;
	endAdornment?: ReactNode;

	wrapperProps?: HTMLAttributes<HTMLDivElement>;
}

export interface InputProps
	extends InputStrictProps,
		Omit<InputHTMLAttributes<HTMLInputElement>, 'color' | 'size'> {}

export default function Input({
	type = 'text',
	variant,
	size,
	color,
	invalid,
	focused,
	disabled,
	loading,
	fullwidth,
	startAdornment,
	endAdornment,
	wrapperProps,
	...props
}: InputProps) {
	return (
		<div
			data-style-invalid={invalid ? '' : null}
			data-style-disabled={disabled ? '' : null}
			data-style-focused={focused ? '' : null}
			data-style-fullwidth={fullwidth ? '' : null}
			{...wrapperProps}
			className={classes(
				InputStyle.input,
				inputVariantClass(variant),
				inputSizeClass(size),
				inputColorClass(color),
				wrapperProps?.className
			)}
		>
			{loading ? <Ring180 /> : startAdornment}
			<input type={type} disabled={disabled} {...props} />
			{endAdornment}
		</div>
	);
}
