import IconButton from '@mui/material/IconButton';
import { useAppDispatch } from 'app/store/hooks';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { toggleTicketPanel } from './ticketPanelSlice';

function TicketPanelToggleButton(props) {
  const { children = <FuseSvgIcon>heroicons-outline:ticket</FuseSvgIcon> } = props;
  const dispatch = useAppDispatch();
  
  return (
    <IconButton
      className="w-40 h-40"
      onClick={() => dispatch(toggleTicketPanel())}
      size="large"
    >
      {children}
    </IconButton>
  );
}

export default TicketPanelToggleButton;