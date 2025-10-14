// import { styled } from '@mui/material/styles';
// import ListItemText from '@mui/material/ListItemText';
// import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
// import ListItemButton from '@mui/material/ListItemButton';
// import UserAvatar from '../../UserAvatar';

// const StyledListItem = styled(ListItemButton)(({ theme }) => ({
// 	'&.active': {
// 		backgroundColor: theme.palette.background.default
// 	}
// }));

// /**
//  * The contact payments item.
//  */
// function ContactListItem(props) {
// 	const { item } = props;
// 	return (
// 		<StyledListItem
// 			component={NavLinkAdapter}
// 			className="px-32 py-12 min-h-80"
// 			to={`/apps/messenger/${item.id}`}
// 			end
// 			activeClassName="active"
// 		>
// 			<UserAvatar user={item} />

// 			<ListItemText
// 				classes={{
// 					root: 'min-w-px px-16',
// 					primary: 'font-medium text-14',
// 					secondary: 'truncate'
// 				}}
// 				primary={item.name}
// 			/>
// 		</StyledListItem>
// 	);
// }

// export default ContactListItem;

import { styled } from '@mui/material/styles';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import format from 'date-fns/format';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemButton from '@mui/material/ListItemButton';
import { Chip } from '@mui/material';
import clsx from 'clsx';

const StyledListItem = styled(ListItemButton)(({ theme }) => ({
  '&.active': {
    backgroundColor: theme.palette.background.default
  }
}));

// Map of ticket status to color
const statusColors = {
  'PENDING': 'warning',
  'IN_PROGRESS': 'info',
  'ANSWERED': 'success',
  'CLOSED': 'error'
};

// Map of ticket status to label
const statusLabels = {
  'PENDING': 'در انتظار پاسخ',
  'IN_PROGRESS': 'در انتظار پاسخ',
  'ANSWERED': 'پاسخ داده شده',
  'CLOSED': 'بسته'
};

function TicketListItem({ ticket }) {
  const formatCreatedAt = (dateString) => {
    try {
      // Try to parse as ISO date string
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return format(date, 'PP');
      }
      // If the date is already formatted as a string, just return it
      return dateString;
    } catch (error) {
      return dateString || 'Unknown date';
    }
  };

  return (
    <StyledListItem
      component={NavLinkAdapter}
      className="px-32 py-12 min-h-80"
      to={`/apps/ticketing/${ticket.id}`}
      end
      activeClassName="active"
    >
      <div className="flex flex-col flex-grow">
        <div className="flex items-center justify-between">
          <Typography 
            className="text-16 font-semibold truncate" 
            noWrap
            title={ticket.subject}
            sx={{
              maxWidth: '250px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {ticket.subject}
          </Typography>
          <Typography
            className="whitespace-nowrap font-medium text-12"
            color="text.secondary"
          >
            {formatCreatedAt(ticket.createdAtStr || ticket.createdAt)}
          </Typography>
        </div>
        
        <div className="flex items-center mt-4 pr-8 justify-between">
          <div className="flex items-center">
            <Chip 
              size="small"
              label={statusLabels[ticket.status] || ticket.status}
              color={statusColors[ticket.status] || 'default'}
              className={clsx("ml-8", ticket.hasAttachment ? "mb-8" : "")}
            />
            <Typography
              className="text-13"
              color="text.secondary"
            >
              {ticket.ticketRefId}#
            </Typography>
          </div>
          
          {ticket.hasAttachment && (
            <div className="flex items-center">
              <Typography 
                className="flex items-center text-12"
                color="text.secondary"
              >
                <span className="mr-4">📎</span> Attachments
              </Typography>
            </div>
          )}
        </div>
      </div>
    </StyledListItem>
  );
}

export default TicketListItem;