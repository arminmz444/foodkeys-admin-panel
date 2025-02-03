import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function LightboxButton({ onClick }) {
	return (
		<Box sx={{ mb: 2 }}>
			<Button
				variant="contained"
				onClick={onClick}
			>
				باز کردن گالری
			</Button>
		</Box>
	);
}
