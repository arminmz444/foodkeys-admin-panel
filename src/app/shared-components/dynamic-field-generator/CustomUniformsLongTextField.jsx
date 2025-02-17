import { connectField } from 'uniforms';
import TextField from '@mui/material/TextField';

function CustomUniformsLongTextField({ onChange, label, placeholder }) {
	return (
		<TextField
			id="outlined-multiline-static"
			placeholder={placeholder}
			label={label || 'توضیحات'}
			className="my-12"
			multiline
			fullWidth
			rows={4}
			onChange={(e) => onChange(e.target.value)}
		/>
	);
}

export default connectField(CustomUniformsLongTextField);
