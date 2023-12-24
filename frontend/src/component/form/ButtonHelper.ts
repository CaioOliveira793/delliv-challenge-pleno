import ButtonStyle from '@/style/form/button.module.css';
import { classes } from '@/style/helper';

export type ButtonVariant =
	| 'contained'
	| 'outlined'
	| 'text'
	| 'icon_contained'
	| 'icon_outlined'
	| 'icon_flat';

export function variantClass(variant?: ButtonVariant): string {
	switch (variant) {
		case 'contained':
			return ButtonStyle.contained;
		case 'outlined':
			return ButtonStyle.outlined;
		case 'text':
			return ButtonStyle.text;
		case 'icon_contained':
			return ButtonStyle.icon_contained;
		case 'icon_outlined':
			return ButtonStyle.icon_outlined;
		case 'icon_flat':
			return ButtonStyle.icon_flat;
		default:
			return ButtonStyle.contained;
	}
}

export type ButtonColor = 'primary' | 'info' | 'success' | 'warning' | 'error' | 'current';

export function colorClass(color?: ButtonColor): string {
	switch (color) {
		case 'primary':
			return ButtonStyle.primary;
		case 'info':
			return ButtonStyle.info;
		case 'success':
			return ButtonStyle.success;
		case 'warning':
			return ButtonStyle.warning;
		case 'error':
			return ButtonStyle.error;
		case 'current':
			return ButtonStyle.current;
		default:
			return ButtonStyle.primary;
	}
}

export type ButtonSize = 'none' | 'small' | 'medium' | 'large';

export function sizeClass(size?: ButtonSize): string {
	switch (size) {
		case 'none':
			return ButtonStyle.none;
		case 'small':
			return ButtonStyle.small;
		case 'medium':
			return ButtonStyle.medium;
		case 'large':
			return ButtonStyle.large;
		default:
			return ButtonStyle.medium;
	}
}

export interface ButtonClasses {
	variant?: ButtonVariant;
	color?: ButtonColor;
	size?: ButtonSize;
}

export function buttonClass(classs: ButtonClasses): string {
	return classes(
		ButtonStyle.button,
		variantClass(classs.variant),
		colorClass(classs.color),
		sizeClass(classs.size)
	);
}
