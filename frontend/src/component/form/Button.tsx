import { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import { classes } from '@/style/helper';
import Ring180 from '@/component/spinner/Ring180';
import { ButtonColor, ButtonSize, ButtonVariant, buttonClass } from '@/component/form/ButtonHelper';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	color?: ButtonColor;
	size?: ButtonSize;
	loading?: boolean;
	disabled?: boolean;

	startIcon?: ReactNode | null;
	endIcon?: ReactNode | null;

	className?: string;
}

export default function Button({
	children,
	className,
	variant,
	color,
	size,
	loading,
	disabled,
	startIcon,
	endIcon,
	...props
}: PropsWithChildren<ButtonProps>) {
	return (
		<button
			className={classes(buttonClass({ variant, color, size }), className)}
			disabled={disabled || loading}
			{...props}
		>
			{loading ? <Ring180 /> : startIcon}
			{children}
			{endIcon}
		</button>
	);
}
