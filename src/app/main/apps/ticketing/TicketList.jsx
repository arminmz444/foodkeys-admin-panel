import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import { motion } from 'framer-motion';
import { memo, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import clsx from 'clsx';
import { Box, CircularProgress } from '@mui/material';
import { selectSelectedTicketId, setSelectedTicketId, openTicketPanel } from './ticketPanelSlice';
import TicketButton from './TicketButton';
import { useGetTicketsQuery, useGetUserProfileQuery } from './TicketsApi';

const Root = styled(FuseScrollbars)(({ theme }) => ({
  background: theme.palette.background.paper
}));

const container = {
  show: {
    transition: {
      staggerChildren: 0.025
    }
  }
};

const item = {
  hidden: { opacity: 0, scale: 0.6 },
  show: { opacity: 1, scale: 1 }
};

function TicketList(props) {
  const { className } = props;
  const dispatch = useAppDispatch();
  const selectedTicketId = useAppSelector(selectSelectedTicketId);
  const ticketListScroll = useRef(null);
  const { data: tickets, isLoading: isTicketsLoading } = useGetTicketsQuery();
  const { data: user, isLoading: isUserLoading } = useGetUserProfileQuery();
  
  const scrollToTop = () => {
    if (!ticketListScroll.current) {
      return;
    }

    ticketListScroll.current.scrollTop = 0;
  };
  
  const handleTicketClick = (ticketId) => {
    dispatch(openTicketPanel());
    dispatch(setSelectedTicketId(ticketId));
    scrollToTop();
  };

  if (isTicketsLoading || isUserLoading) {
    return (
      <Box
        className="flex justify-center py-12"
        sx={{
          width: 70,
          minWidth: 70
        }}
      >
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Root
      className={clsx('flex shrink-0 flex-col overflow-y-auto py-8 overscroll-contain', className)}
      ref={ticketListScroll}
      option={{ suppressScrollX: true, wheelPropagation: false }}
    >
      {tickets?.length > 0 && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col shrink-0"
        >
          {tickets.map((ticket) => {
            return (
              <motion.div
                variants={item}
                key={ticket.id}
              >
                <TicketButton
                  ticket={ticket}
                  selectedTicketId={selectedTicketId}
                  onClick={handleTicketClick}
                />
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </Root>
  );
}

export default memo(TicketList);