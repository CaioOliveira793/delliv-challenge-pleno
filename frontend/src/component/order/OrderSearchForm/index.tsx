import { FormHTMLAttributes } from 'react';
import TextInput from '@/component/form/TextInput';
import Button from '@/component/form/Button';
import { classes } from '@/style/helper';
import OrderSearchFormStyle from './OrderSearchForm.module.css';
import { FORM_ERROR_FIELD, OnChange, OnSubmit, mapFilterErrorField, useForm } from '@/hook/useForm';
import { OrderQuery } from '@/service/Resource';
import ErrorList from '@/component/form/ErrorList';

export interface OrderSearchFormProps
	extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'onChange'> {
	initial?: OrderQuery;
	onSearch?: OnSubmit<OrderQuery>;
	onChange?: OnChange<OrderQuery>;
}

export default function OrderSearchForm({
	className,
	initial,
	onSearch,
	onChange,
	...props
}: OrderSearchFormProps) {
	const { errors, handleChange, handleSubmit } = useForm({
		initial,
		onSubmit: onSearch,
		onChange,
	});

	const formErrors = mapFilterErrorField(errors, FORM_ERROR_FIELD);

	return (
		<form
			className={classes(OrderSearchFormStyle.search_form, className)}
			onSubmit={handleSubmit}
			{...props}
		>
			<TextInput
				name="status"
				placeholder="Status"
				type="text"
				inputMode="search"
				fullwidth
				errors={mapFilterErrorField(errors, 'status')}
				onChange={handleChange}
			/>
			<Button type="submit" className={OrderSearchFormStyle.search_action}>
				Buscar
			</Button>
			{formErrors.length !== 0 ? <ErrorList errors={formErrors} /> : null}
		</form>
	);
}
