import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useContext } from 'react';
import { motion } from 'framer-motion';
import { TicketAppContext } from './TicketingApp';

function TicketingFirstScreen() {
  const { setMainSidebarOpen } = useContext(TicketAppContext);
  
  return (
    <motion.div 
      className="flex flex-col flex-1 items-center justify-center w-full p-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.1 } }}
    >
      <FuseSvgIcon
        className="icon-size-128 mb-16"
        color="disabled"
      >
        heroicons-outline:ticket
      </FuseSvgIcon>
      <Typography
        className="hidden lg:flex text-20 font-semibold tracking-tight text-secondary"
        color="text.secondary"
      >
        Select a ticket or create a new one
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        className="flex lg:hidden mt-16"
        onClick={() => setMainSidebarOpen(true)}
      >
        Select a ticket or create a new one
      </Button>
    </motion.div>
  );
}

export default TicketingFirstScreen;