// import { useContext, useState } from 'react';
// import IconButton from '@mui/material/IconButton';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
// import { ChatAppContext } from '../TicketingApp.jsx';

// /**
//  * The main sidebar more menu.
//  */
// function MainSidebarMoreMenu(props) {
// 	const { setContactSidebarOpen } = useContext(ChatAppContext);
// 	const { className } = props;
// 	const [moreMenuEl, setMoreMenuEl] = useState(null);

// 	function handleMoreMenuClick(event) {
// 		setMoreMenuEl(event.currentTarget);
// 	}

// 	function handleMoreMenuClose() {
// 		setMoreMenuEl(null);
// 	}

// 	return (
// 		<div className={className}>
// 			<IconButton
// 				aria-haspopup="true"
// 				onClick={handleMoreMenuClick}
// 				size="large"
// 			>
// 				<FuseSvgIcon>heroicons-outline:dots-vertical</FuseSvgIcon>
// 			</IconButton>
// 			<Menu
// 				id="chats-more-menu"
// 				anchorEl={moreMenuEl}
// 				open={Boolean(moreMenuEl)}
// 				onClose={handleMoreMenuClose}
// 			>
// 				<MenuItem
// 					onClick={() => {
// 						setContactSidebarOpen(true);
// 						handleMoreMenuClose();
// 					}}
// 				>
// 					Contact info
// 				</MenuItem>
// 			</Menu>
// 		</div>
// 	);
// }

// export default MainSidebarMoreMenu;


import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useNavigate } from 'react-router-dom';
import { ListItemIcon, ListItemText } from '@mui/material';
import { 
  useDeleteTicketMutation,
  useUpdateTicketStatusMutation
} from '../TicketingApi';

function TicketChatMoreMenu(props) {
  const { className, ticket, isAdmin } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  
  const [updateTicketStatus] = useUpdateTicketStatusMutation();
  const [deleteTicket] = useDeleteTicketMutation();

  function handleMenuClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  async function handleStatusChange(status) {
    try {
      await updateTicketStatus({
        ticketId: ticket.id,
        status
      });
      handleMenuClose();
    } catch (error) {
      console.error('Failed to update ticket status:', error);
    }
  }

  async function handleDeleteTicket() {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await deleteTicket(ticket.id);
        navigate('/apps/tickets');
      } catch (error) {
        console.error('Failed to delete ticket:', error);
      }
    }
    handleMenuClose();
  }

  return (
    <div className={className}>
      <IconButton
        aria-haspopup="true"
        onClick={handleMenuClick}
        size="large"
      >
        <FuseSvgIcon>heroicons-outline:dots-vertical</FuseSvgIcon>
      </IconButton>
      <Menu
        id="ticket-more-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {isAdmin && ticket.status !== 'IN_PROGRESS' && (
          <MenuItem onClick={() => handleStatusChange('IN_PROGRESS')}>
            <ListItemIcon>
              <FuseSvgIcon size={20}>heroicons-outline:play</FuseSvgIcon>
            </ListItemIcon>
            <ListItemText primary="Mark as In Progress" />
          </MenuItem>
        )}
        
        {isAdmin && ticket.status !== 'ANSWERED' && (
          <MenuItem onClick={() => handleStatusChange('ANSWERED')}>
            <ListItemIcon>
              <FuseSvgIcon size={20}>heroicons-outline:check</FuseSvgIcon>
            </ListItemIcon>
            <ListItemText primary="Mark as Answered" />
          </MenuItem>
        )}
        
        {ticket.status !== 'CLOSED' && (
          <MenuItem onClick={() => handleStatusChange('CLOSED')}>
            <ListItemIcon>
              <FuseSvgIcon size={20}>heroicons-outline:x-circle</FuseSvgIcon>
            </ListItemIcon>
            <ListItemText primary="بستن تیکت" />
          </MenuItem>
        )}
        
        {ticket.status === 'CLOSED' && (
          <MenuItem onClick={() => handleStatusChange('IN_PROGRESS')}>
            <ListItemIcon>
              <FuseSvgIcon size={20}>heroicons-outline:refresh</FuseSvgIcon>
            </ListItemIcon>
            <ListItemText primary="باز کردن تیکت" />
          </MenuItem>
        )}
        
        {isAdmin && (
          <MenuItem onClick={handleDeleteTicket}>
            <ListItemIcon>
              <FuseSvgIcon size={20} color="error">heroicons-outline:trash</FuseSvgIcon>
            </ListItemIcon>
            <ListItemText primary="Delete Ticket" />
          </MenuItem>
        )}
      </Menu>
    </div>
  );
}

export default TicketChatMoreMenu;