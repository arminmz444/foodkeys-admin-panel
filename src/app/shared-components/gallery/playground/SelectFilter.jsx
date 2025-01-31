import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import Filter from './Filter';

export default function SelectFilter({ label, multiple, options, value, onChange }) {
	return (
		<Filter>
			<TextField
				select
				fullWidth
				size="small"
				variant="standard"
				label={label}
				value={value}
				onChange={(event) => {
					onChange(event.target.value);
				}}
				{...(multiple ? { SelectProps: { multiple: true } } : null)}
			>
				{options.map((option) => {
					return (
						<MenuItem
							key={option}
							value={option}
						>
							{option === '' ? <>&nbsp;</> : option}
						</MenuItem>
					);
				})}
			</TextField>
		</Filter>
	);
}
