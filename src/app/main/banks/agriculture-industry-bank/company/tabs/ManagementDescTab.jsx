import TextField from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';

function ManagementDescTab(props) {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	return (
		<div>
			<Controller
				name="managementDesc"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16 sm:mx-4"
						multiline
						minRows={5}
						label="توضیحات مدیریت"
						id="managementDesc"
						variant="outlined"
						fullWidth
					/>
				)}
			/>
			<Controller
				name="record"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16 sm:mx-4"
						multiline
						minRows={5}
						label="ثبت سوابق"
						id="record"
						variant="outlined"
						fullWidth
					/>
				)}
			/>
		</div>
	);
}

export default ManagementDescTab;
