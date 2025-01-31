import Grid from '@mui/material/Grid';

export default function Filter({ children }) {
	return (
		<Grid
			item
			xs={12}
			sm={6}
			lg={4}
		>
			{children}
		</Grid>
	);
}
