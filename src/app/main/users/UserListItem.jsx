import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import NavLinkAdapter from "@fuse/core/NavLinkAdapter";
import ListItemButton from "@mui/material/ListItemButton";
import { getServerFile } from '@/utils/string-utils.js';

/**
 * The user list item.
 */
function UserListItem(props) {
	const { user } = props;
	return (
		<>
			<ListItemButton
				className="px-32 py-16 "
				sx={{ bgcolor: "background.paper" }}
				component={NavLinkAdapter}
				to={`/apps/users/${user.id}`}
			>
				<ListItemAvatar>
					<Avatar
						alt={`${user.firstName} ${user.lastName}`}
						src={user.avatar && getServerFile(user.avatar.filePath)}
						className="shadow-7"
					/>
				</ListItemAvatar>
				<ListItemText
					classes={{
						root: "m-0",
						primary: "font-800 leading-5 truncate text-lg"
					}}
					primary={`${user.firstName} ${user.lastName}`}
					secondary={
						<Typography
							className="inline text-base font-400"
							component="span"
							// variant="body2"
							color="text.secondary"
						>
							{`${user.email} | ${user.username}`}
						</Typography>
					}
				/>
			</ListItemButton>
			<Divider />
		</>
	);
}

export default UserListItem;
