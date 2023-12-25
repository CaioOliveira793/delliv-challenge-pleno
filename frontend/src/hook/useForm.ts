import { useState, ChangeEvent, FormEvent } from 'react';

export const FORM_ERROR_FIELD = '@form-error';

export type FormErrorField<T> = keyof T | typeof FORM_ERROR_FIELD;

export interface FormError<T> {
	field: FormErrorField<T>;
	message: string;
}

export type OnSubmit<T> = (data: T) => Array<FormError<T>>;
export type OnChange<T> = (data: T, errors: Array<FormError<T>>) => void;
export type ValidateFn<T> = (data: T) => Array<FormError<T>>;

export interface UseFormInput<T extends object> {
	initial?: T;
	onSubmit?: OnSubmit<T>;
	onChange?: OnChange<T>;
	validate?: ValidateFn<T>;
}

export interface UseFormReturn<T extends object> {
	data: T;
	errors: Array<FormError<T>>;
	handleChange(event: ChangeEvent<HTMLInputElement>): void;
	handleSubmit(event: FormEvent<HTMLFormElement>): void;
}

export function useForm<T extends object>({
	initial,
	onSubmit,
	onChange,
	validate,
}: UseFormInput<T>): UseFormReturn<T> {
	const [data, setData] = useState<T>(initial ?? ({} as T));
	const [errors, setErrors] = useState<Array<FormError<T>>>([]);

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;
		const newData = { ...data, [name]: value };
		const errors = validate?.(newData) ?? [];

		onChange?.(newData, errors);

		setErrors(errors);
		setData(newData);
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const errors = onSubmit?.(data) ?? [];
		setErrors(errors);
	}

	return { data, errors, handleChange, handleSubmit };
}

export function mapFilterErrorField<T>(
	errors: Array<FormError<T>>,
	field: FormErrorField<T>
): string[] {
	return errors.filter(err => err.field === field).map(err => err.message);
}
