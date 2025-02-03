import Typography from '@mui/material/Typography';

export default function Paragraph({ children, ...rest }) {
	return (
		<Typography
			paragraph
			{...rest}
		>
			{children}
		</Typography>
	);
}
