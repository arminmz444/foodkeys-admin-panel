import { Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import TextField from '@mui/material/TextField';

function MapTab(props) {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	return (
		<div>
			<Typography
				variant="h5"
				color="WindowText"
				className="font-bold"
			>
				ثبت کننده اطلاعات{' '}
			</Typography>

			{/* <Controller */}
			{/*	name="registrantUsername" */}
			{/*	control={control} */}
			{/*	render={({ field, fieldState: { error } }) => ( */}
			{/*		<CustomSelect */}
			{/*			{...field} */}
			{/*			className="mt-16 mb-16 sm:mx-4" */}
			{/*			setFieldValue={field.onChange} */}
			{/*			setFieldTouched={field.onBlur} */}
			{/*			url="/user/options" */}
			{/*			additionalParams={{ pageSize: 8 }} */}
			{/*			noOptionsMessage="کاربری پیدا نشد" */}
			{/*			loadingMessage="در حال بارگذاری کاربران..." */}
			{/*			// Optionally add checkBoxes, searchOption, setSearchOption if needed */}
			{/*			// checkBoxes={[ */}
			{/*			//   { label: 'Search by Name', value: 'name' }, */}
			{/*			//   { label: 'Search by ID', value: 'id' } */}
			{/*			// ]} */}
			{/*		/> */}
			{/*	)} */}
			{/* /> */}
			<Controller
				name="registrantUsername"
				control={control}
				render={({ field }) => (
					<TextField
						required
						{...field}
						className="mt-8 mb-16 sm:mx-4"
						error={!!errors.username}
						helperText={errors?.username?.message}
						label="نام کاربری"
						id="registrantUsername"
						variant="outlined"
						fullWidth
					/>
				)}
			/>
			<Controller
				name="username"
				control={control}
				render={({ field }) => (
					<TextField
						required
						{...field}
						className="mt-8 mb-16 sm:mx-4"
						error={!!errors.username}
						helperText={errors?.username?.message}
						label="نام کاربری"
						id="username"
						variant="outlined"
						fullWidth
					/>
				)}
			/>
			<Controller
				name="fullname"
				control={control}
				render={({ field }) => (
					<TextField
						required
						{...field}
						className="mt-8 mb-16 sm:mx-4"
						error={!!errors.fullname}
						helperText={errors?.fullname?.message}
						label="نام و نام خانوادگی"
						id="fullname"
						variant="outlined"
						fullWidth
					/>
				)}
			/>
			<Controller
				name="mobile"
				control={control}
				render={({ field }) => (
					<TextField
						type="number"
						required
						{...field}
						className="mt-8 mb-16 sm:mx-4"
						error={!!errors.mobile}
						helperText={errors?.mobile?.message || '(مثال: 09123456789)'}
						label="تلفن همراه"
						id="mobile"
						variant="outlined"
						fullWidth
					/>
				)}
			/>
		</div>
	);
}

export default MapTab;
