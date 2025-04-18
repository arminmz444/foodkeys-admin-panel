import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import GenericListInput from '../GenericListInput.jsx';
import { ContactPhoneModel } from '../../models/ContactModel';
import PhoneNumberItem from './PhoneNumberItem.jsx';

function PhoneNumberList({ name = 'phoneNumbers', defaultValue = [] }) {
	// In your real form, you'd pass in useForm from your parent
	// or you'd accept parent form methods as props. Example:
	const methods = useForm({
		defaultValues: {
			[name]: defaultValue
		}
	});

	const { handleSubmit, watch } = methods;

	const onSubmit = (data) => {
		console.log('Submitted phone numbers:', data);
	};

	return (
		<FormProvider {...methods}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<GenericListInput
					name={name}
					label="Phone Numbers"
					addButtonLabel="افزودن شماره تلفن"
					makeDefault={() => ContactPhoneModel(null)}
					ItemComponent={PhoneNumberItem}
				/>
				<button type="submit">Save</button>
			</form>
		</FormProvider>
	);
}

export default PhoneNumberList;
