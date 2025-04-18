import Typography from '@mui/material/Typography';

export default function Title({ sx, children, ...rest }) {
	return (
		<Typography
			variant="h2"
			color="primary"
			sx={{ mt: 3, mb: 2, ...sx }}
			{...rest}
		>
			{children}
		</Typography>
	);
}
