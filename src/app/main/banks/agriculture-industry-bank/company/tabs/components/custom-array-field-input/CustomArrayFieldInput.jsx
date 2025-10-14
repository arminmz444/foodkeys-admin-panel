import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Controller, useForm } from 'react-hook-form';
import IconButton from '@mui/material/IconButton';
import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// import CountryCodeSelector from '@/app/main/users/user/phone-number-selector/CountryCodeSelector.jsx';
// Zod schema for ContactPhoneNumber
const schema = z.object({
	country: z.string().optional(),
	phoneNumber: z.string().optional(),
	label: z.string().optional()
});
const defaultValues = {
	country: '',
	phoneNumber: '',
	label: ''
};

/**
 * The phone number input.
 */
function CustomArrayFieldInput(props) {
	const {
		value,
		hideRemove = false,
		onChange,
		onRemove,
		typeInputName = 'type',
		typeInputLabel = 'برچسب',
		typeInputPlaceholder = 'برچسب',
		inputName,
		inputLabel,
		inputPlaceholder,
		inputType = 'text',
		haveTypeInput = true,
		haveTypeSelector = false,
		startAdornmentIcon = 'heroicons-solid:phone'
	} = props;
	const { control, formState, handleSubmit, reset } = useForm({
		mode: 'all',
		defaultValues,
		resolver: zodResolver(schema)
	});
	const { errors } = formState;
	useEffect(() => {
		reset(value);
	}, [reset, value]);

	function onSubmit(data) {
		onChange(data);
	}

	return (
		<form
			className="flex space-x-16 mb-16"
			onChange={handleSubmit(onSubmit)}
		>
			{haveTypeInput ? (
				<Controller
					control={control}
					name={typeInputName}
					render={({ field }) => (
						<TextField
							{...field}
							label={typeInputLabel}
							placeholder={typeInputPlaceholder}
							variant="outlined"
							fullWidth
							type={inputType}
							className="me-10"
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
			) : (
				<></>
			)}
			<Controller
				control={control}
				name={inputName}
				render={({ field }) => (
					<TextField
						{...field}
						label={inputLabel}
						placeholder={inputPlaceholder}
						variant="outlined"
						fullWidth
						error={!!errors.phoneNumber}
						helperText={errors?.phoneNumber?.message}
						InputProps={{
							startAdornment: haveTypeSelector ? (
								<Controller
									control={control}
									name="country"
									// render={({ field: _field }) => (
									// 	<InputAdornment position="start">
									// 		{/* <CountryCodeSelector {..._field} /> */}
									// 	</InputAdornment>
									// )}
								/>
							) : (
								<InputAdornment position="start">
									<FuseSvgIcon size={20}>{startAdornmentIcon}</FuseSvgIcon>
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
						onRemove(value);
					}}
				>
					<FuseSvgIcon size={20}>heroicons-solid:trash</FuseSvgIcon>
				</IconButton>
			)}
		</form>
	);
}

export default CustomArrayFieldInput;
