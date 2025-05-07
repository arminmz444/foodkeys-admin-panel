// import { useContext, useState } from 'react';
// import IconButton from '@mui/material/IconButton';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
// import { ChatAppContext } from '../../TicketingApp.jsx';

// /**
//  * The main sidebar more menu.
//  */
// function MainSidebarMoreMenu(props) {
// 	const { className } = props;
// 	const { setUserSidebarOpen } = useContext(ChatAppContext);
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
// 						setUserSidebarOpen(true);
// 						handleMoreMenuClose();
// 					}}
// 				>
// 					پروفایل
// 				</MenuItem>
// 				<MenuItem onClick={handleMoreMenuClose}>Logout</MenuItem>
// 			</Menu>
// 		</div>
// 	);
// }

// export default MainSidebarMoreMenu;
import { useContext, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { TicketAppContext } from '../../TicketingApp';
import { ListItemIcon, ListItemText } from '@mui/material';

function MainSidebarMoreMenu(props) {
  const { className } = props;
  const { setUserSidebarOpen } = useContext(TicketAppContext);
  const [moreMenuEl, setMoreMenuEl] = useState(null);

  function handleMoreMenuClick(event) {
    setMoreMenuEl(event.currentTarget);
  }

  function handleMoreMenuClose() {
    setMoreMenuEl(null);
  }

  return (
    <div className={className}>
      <IconButton
        aria-haspopup="true"
        onClick={handleMoreMenuClick}
        size="large"
      >
        <FuseSvgIcon>heroicons-outline:dots-vertical</FuseSvgIcon>
      </IconButton>
      <Menu
        id="chats-more-menu"
        anchorEl={moreMenuEl}
        open={Boolean(moreMenuEl)}
        onClose={handleMoreMenuClose}
      >
        <MenuItem
          onClick={() => {
            setUserSidebarOpen(true);
            handleMoreMenuClose();
          }}
        >
          <ListItemIcon>
            <FuseSvgIcon size={20}>heroicons-outline:user-circle</FuseSvgIcon>
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </MenuItem>
        <MenuItem onClick={handleMoreMenuClose}>
          <ListItemIcon>
            <FuseSvgIcon size={20}>heroicons-outline:logout</FuseSvgIcon>
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    </div>
  );
}

export default MainSidebarMoreMenu;