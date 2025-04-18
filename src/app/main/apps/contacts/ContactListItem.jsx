import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import NavLinkAdapter from "@fuse/core/NavLinkAdapter";
import ListItemButton from "@mui/material/ListItemButton";

/**
 * The contact payments item.
 */
function ContactListItem(props) {
	const { contact } = props;
	return (
		<>
			<ListItemButton
				className="px-32 py-16 "
				sx={{ bgcolor: "background.paper" }}
				component={NavLinkAdapter}
				to={`/apps/contacts/${contact.id}`}
			>
				<ListItemAvatar>
					<Avatar
						alt={contact.name}
						src={contact.avatar}
						className="shadow-7"
					/>
				</ListItemAvatar>
				<ListItemText
					classes={{
						root: "m-0",
						primary: "font-800 leading-5 truncate text-lg",
					}}
					primary={contact.name}
					secondary={
						<Typography
							className="inline text-base font-400"
							component="span"
							// variant="body2"
							color="text.secondary"
						>
							{contact.emails[0].email +
								" | " +
								contact.phoneNumbers[0].phoneNumber}
						</Typography>
					}
				/>
			</ListItemButton>
			<Divider />
		</>
	);
}

export default ContactListItem;
