import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import clsx from 'clsx';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Badge, Chip } from '@mui/material';

const Root = styled(Tooltip)(({ theme, active }) => ({
  width: 70,
  minWidth: 70,
  flex: '0 0 auto',
  ...(active && {
    '&:after': {
      position: 'absolute',
      top: 8,
      right: 0,
      bottom: 8,
      content: "''",
      width: 4,
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
      backgroundColor: theme.palette.primary.main
    }
  })
}));

// Map status to icon
const statusIcons = {
  'PENDING': 'heroicons-outline:clock',
  'IN_PROGRESS': 'heroicons-outline:refresh',
  'ANSWERED': 'heroicons-outline:check',
  'CLOSED': 'heroicons-outline:x-circle'
};

// Map status to color
const statusColors = {
  'PENDING': 'warning.main',
  'IN_PROGRESS': 'info.main',
  'ANSWERED': 'success.main',
  'CLOSED': 'error.main' 
};

function TicketButton(props) {
  const { ticket, selectedTicketId, onClick } = props;
  
  // Get first letter of subject for avatar
  const getInitial = () => {
    return ticket.subject ? ticket.subject[0].toUpperCase() : '#';
  };

  return (
    <Root
      title={ticket.subject}
      placement="left"
      active={selectedTicketId === ticket.id ? 1 : 0}
    >
      <Button
        onClick={() => onClick(ticket.id)}
        className={clsx(
          'ticketButton rounded-0 py-4 h-auto min-h-auto max-h-none',
          selectedTicketId === ticket.id && 'active'
        )}
      >
        <Badge
          color="error"
          variant="dot"
          invisible={!ticket.hasAttachment}
          sx={{ 
            '& .MuiBadge-badge': {
              right: 6,
              top: 6
            }
          }}
        >
          <div className="relative">
            <Avatar className="mx-auto">
              {getInitial()}
            </Avatar>
            <div 
              className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ 
                backgroundColor: (theme) => theme.palette.background.paper
              }}
            >
              <FuseSvgIcon
                size={12}
                color="disabled"
                sx={{
                  color: (theme) => theme.palette[statusColors[ticket.status]]
                }}
              >
                {statusIcons[ticket.status] || 'heroicons-outline:question-mark-circle'}
              </FuseSvgIcon>
            </div>
          </div>
        </Badge>
      </Button>
    </Root>
  );
}

export default TicketButton;