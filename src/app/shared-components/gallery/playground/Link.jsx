import { Link as RouterLink } from 'react-router-dom';
import MuiLink from '@mui/material/Link';

export default function Link({ href, children, ...rest }) {
	return (
		<MuiLink
			component={RouterLink}
			to={href}
			{...rest}
		>
			{children}
		</MuiLink>
	);
}
