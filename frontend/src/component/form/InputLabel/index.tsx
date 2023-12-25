import { LabelHTMLAttributes } from 'react';
import TypographyStyle from '@/style/typography.module.css';
import InputLabelStyle from './InputLabel.module.css';

export interface InputLabelStrictProps {
	asterisk?: boolean;
	label?: string;
}

export interface InputLabelProps
	extends InputLabelStrictProps,
		LabelHTMLAttributes<HTMLLabelElement> {}

export default function InputLabel({ asterisk = false, label = '', ...props }: InputLabelProps) {
	return (
		<label className={TypographyStyle.body2} {...props}>
			{asterisk ? label + ' ' : label}
			{asterisk ? <span className={InputLabelStyle.asterisk}>*</span> : null}
		</label>
	);
}
