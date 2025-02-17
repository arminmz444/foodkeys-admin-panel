import TextField from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';
import WYSIWYGEditor from 'app/shared-components/WYSIWYGEditor.jsx';
import InputAdornment from '@mui/material/InputAdornment';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon/index.js';

function HistoryTab(props) {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	return (
		<div>
			<Controller
				render={({ field }) => (
					<WYSIWYGEditor
						direction="ltr"
						dir="ltr"
						style={{ textAlign: 'left', direction: 'ltr' }}
						className="mt-8 mb-16"
						{...field}
					/>
				)}
				name="message"
				control={control}
			/>
			<Controller
				name="coHistory"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						id="coHistory"
						label="تاریخچه شرکت"
						type="text"
						multiline
						rows={5}
						variant="outlined"
						fullWidth
						InputProps={{
							className: 'max-h-min h-min items-start',
							startAdornment: (
								<InputAdornment
									className="mt-16"
									position="start"
								>
									<FuseSvgIcon size={20}>heroicons-solid:menu-alt-2</FuseSvgIcon>
								</InputAdornment>
							)
						}}
					/>
				)}
			/>
		</div>
	);
}

export default HistoryTab;
