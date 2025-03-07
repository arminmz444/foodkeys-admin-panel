import { styled } from '@mui/material/styles';
import ListItemText from '@mui/material/ListItemText';
import clsx from 'clsx';
import { memo, useMemo } from 'react';
import withRouter from '@fuse/core/withRouter';
import { Link, ListItemButton } from '@mui/material';
import FuseNavBadge from '../../FuseNavBadge';
import FuseSvgIcon from '../../../FuseSvgIcon';

const Root = styled(ListItemButton)(({ theme }) => ({
	color: theme.palette.text.primary,
	textDecoration: 'none!important',
	minHeight: 48,
	'&.active': {
		backgroundColor: `${theme.palette.secondary.main}!important`,
		color: `${theme.palette.secondary.contrastText}!important`,
		pointerEvents: 'none',
		'& .fuse-list-item-text-primary': {
			color: 'inherit'
		},
		'& .fuse-list-item-icon': {
			color: 'inherit'
		}
	},
	'& .fuse-list-item-icon': {},
	'& .fuse-list-item-text': {
		padding: '0 0 0 16px'
	}
}));

/*
 * FuseNavHorizontalLink
 * This is a component to render horizontal navigation links in the Fuse navigations.
 * It receieves `FuseNavItemComponentProps` and `WithRouterProps` as props.
 */
function FuseNavHorizontalLink(props) {
	const { item, checkPermission } = props;
	let itemProps;
	const component = item.url ? Link : 'li';

	if (typeof component !== 'string') {
		itemProps = {
			disabled: item.disabled,
			href: item.url,
			role: 'button',
			target: item.target ? item.target : '_blank'
		};
	}

	if (checkPermission && !item?.hasPermission) {
		return null;
	}

	return useMemo(
		() => (
			<Root
				component={component}
				className={clsx('fuse-payments-item')}
				sx={item.sx}
				{...itemProps}
			>
				{item.icon && (
					<FuseSvgIcon
						className={clsx('fuse-payments-item-icon shrink-0', item.iconClass)}
						color="action"
					>
						{item.icon}
					</FuseSvgIcon>
				)}

				<ListItemText
					className="fuse-list-item-text"
					primary={item.title}
					classes={{ primary: 'text-13 fuse-payments-item-text-primary truncate' }}
				/>

				{item.badge && (
					<FuseNavBadge
						className="ltr:ml-8 rtl:mr-8"
						badge={item.badge}
					/>
				)}
			</Root>
		),
		[item.badge, item.icon, item.iconClass, item.target, item.title, item.url]
	);
}

const NavHorizontalLink = withRouter(memo(FuseNavHorizontalLink));
export default NavHorizontalLink;
