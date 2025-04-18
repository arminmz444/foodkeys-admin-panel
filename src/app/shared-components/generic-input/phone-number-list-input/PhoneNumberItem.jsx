import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputAdornment from '@mui/material/InputAdornment';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon/index.js';
import CountryCodeSelector from './CountryCodeSelector';

// Zod schema for phone item
const phoneSchema = z.object({
	country: z.string().optional(),
	phoneNumber: z.string().optional(),
	label: z.string().optional()
});
const defaultValues = {
	country: '',
	phoneNumber: '',
	label: ''
};

function PhoneNumberItem({ value, onChange, onRemove, hideRemove }) {
	const { control, handleSubmit, reset, formState } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(phoneSchema)
	});
	const { errors } = formState;

	useEffect(() => {
		reset(value);
	}, [reset, value]);

	function onSubmit(data) {
		onChange(data);
	}

	return (
		<form onChange={handleSubmit(onSubmit)} className="flex space-x-16 mb-16">
			<Controller
				control={control}
				name="phoneNumber"
				render={({ field }) => (
					<TextField
						{...field}
						label="شماره تلفن"
						placeholder="شماره تلفن"
						variant="outlined"
						fullWidth
						error={!!errors.phoneNumber}
						helperText={errors?.phoneNumber?.message}
						InputProps={{
							startAdornment: (
								<Controller
									control={control}
									name="country"
									render={({ field: cField }) => (
										<InputAdornment position="start">
											<CountryCodeSelector {...cField} />
										</InputAdornment>
									)}
								/>
							)
						}}
					/>
				)}
			/>
			<Controller
				control={control}
				name="label"
				render={({ field }) => (
					<TextField
						{...field}
						label="Label"
						placeholder="Label"
						variant="outlined"
						fullWidth
						error={!!errors.label}
						helperText={errors?.label?.message}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<FuseSvgIcon size={20}>heroicons-solid:tag</FuseSvgIcon>
								</InputAdornment>
							)
						}}
					/>
				)}
			/>
			{!hideRemove && (
				<IconButton
					onClick={(ev) => {
						ev.stopPropagation();
						onRemove();
					}}
				>
					<FuseSvgIcon size={20}>heroicons-solid:trash</FuseSvgIcon>
				</IconButton>
			)}
		</form>
	);
}

export default PhoneNumberItem;
