import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';

function CustomPopover({ content, triggerBtn, searchInput, actionList, open, handleClose, anchorEl }) {
	return (
		<>
			{triggerBtn}
			{content}
			<Popover
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				PaperProps={{
					sx: {
						p: 2,
						minWidth: 300,
						borderRadius: 2,
						boxShadow: 3
					}
				}}
			>
				{searchInput}
				<Divider sx={{ mb: 1 }} />

				{actionList}
			</Popover>
		</>
	);
}

export default CustomPopover;
