import { useForm } from 'uniforms';
import LoadingButton from '@mui/lab/LoadingButton';

function SubmitField({ children, disabled, loading, inputRef, label = 'ثبت', value, ...props }) {
	const { error, state } = useForm();

	return (
		<LoadingButton
			disabled={disabled === undefined ? !!(error || state.disabled || loading) : disabled}
			ref={inputRef}
			type="submit"
			value={value}
			label={label}
			variant="contained"
			loading={loading}
			size="large"
			{...props}
		>
			{children || label}
		</LoadingButton>
	);
}

export default SubmitField;
