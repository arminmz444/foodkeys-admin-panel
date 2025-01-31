import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import Filter from './Filter';

export default function CheckboxFilter({ label, checked, onChange }) {
	return (
		<Filter>
			<FormControlLabel
				label={label}
				control={
					<Checkbox
						size="small"
						checked={checked}
						onChange={(_, checked) => onChange(checked)}
					/>
				}
				sx={{ color: (theme) => theme.palette.text.secondary }}
			/>
		</Filter>
	);
}
