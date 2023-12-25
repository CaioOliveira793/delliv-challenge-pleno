import { FormHTMLAttributes } from 'react';
import TextInput from '@/component/form/TextInput';
import Button from '@/component/form/Button';
import { classes } from '@/style/helper';
import OrderSearchFormStyle from './OrderSearchForm.module.css';

export interface OrderSearchFormProps extends FormHTMLAttributes<HTMLFormElement> {}

export default function OrderSearchForm({ className, ...props }: OrderSearchFormProps) {
	return (
		<form className={classes(OrderSearchFormStyle.search_form, className)} {...props}>
			<TextInput placeholder="Status" type="text" inputMode="search" fullwidth />
			<Button type="submit" className={OrderSearchFormStyle.search_action}>
				Buscar
			</Button>
		</form>
	);
}
