import { lighten, styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { faIR } from 'date-fns/locale';
import { useContext, useEffect, useRef, useState } from 'react';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Toolbar from '@mui/material/Toolbar';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import TicketChatMoreMenu from './TicketChatMoreMenu';
import { TicketAppContext } from '../TicketingApp';
import { 
  useGetTicketByIdQuery,
  useGetTicketMessagesQuery,
  useGetUserProfileQuery,
  useSendTicketMessageMutation,
  useUpdateTicketStatusMutation
} from '../TicketingApi';
import { Button, Chip, CircularProgress, Avatar } from '@mui/material';
import AttachmentUploader from './AttachmentUploader';
import TicketAttachment from './TicketAttachment';
import { motion } from 'framer-motion';
import { getServerFile } from 'src/utils/string-utils.js';
import { ConsoleLogger } from 'aws-amplify/utils';

// Fixed StyledMessageRow component with improved styling for RTL support
const StyledMessageRow = styled('div')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: 8,
  marginBottom: 8,
  maxWidth: '100%',
  
  // Contact (other person) message styles
  '&.contact': {
    alignItems: 'flex-start',
    '& .bubble': {
      backgroundColor: lighten(theme.palette.secondary.main, 0.1),
      color: theme.palette.secondary.contrastText,
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      marginRight: 'auto',
      '& .time': {
        marginLeft: 12
      }
    },
    '&.first-of-group': {
      '& .bubble': {
        borderTopLeftRadius: 20
      }
    },
    '&.last-of-group': {
      '& .bubble': {
        borderBottomLeftRadius: 20
      }
    }
  },
  
  // Me (current user) message styles
  '&.me': {
    alignItems: 'flex-end',
    '& .bubble': {
      backgroundColor: lighten(theme.palette.primary.main, 0.1),
      color: theme.palette.primary.contrastText,
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
      borderTopRightRadius: 5,
      borderBottomRightRadius: 5,
      marginLeft: 'auto',
      '& .time': {
        justifyContent: 'flex-end',
        right: 0,
        marginRight: 12
      }
    },
    '&.first-of-group': {
      '& .bubble': {
        borderTopRightRadius: 20
      }
    },
    '&.last-of-group': {
      '& .bubble': {
        borderBottomRightRadius: 20
      }
    }
  },
  
  // Add spacing between different message groups
  '&.contact + .me, &.me + .contact': {
    marginTop: 24,
  },
  
  // First message in a group styling
  '&.first-of-group': {
    '& .bubble': {
      borderTopLeftRadius: 20,
      paddingTop: 13
    }
  },
  
  // Last message in a group styling
  '&.last-of-group': {
    '& .bubble': {
      borderBottomLeftRadius: 20,
      paddingBottom: 13,
      '& .time': {
        display: 'flex'
      }
    },
    marginBottom: 24 // Increased space after the last message in a group
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

function TicketChat() {
  const { setMainSidebarOpen, setContactSidebarOpen } = useContext(TicketAppContext);
  const chatRef = useRef(null);
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const routeParams = useParams();
  const ticketId = routeParams.id;
  const { data: userData, isLoading: isUserLoading } = useGetUserProfileQuery();
  const userAccesses = userData?.data?.accesses;
  const user = userData?.data?.user;
  const { data: ticket, isLoading: isTicketLoading } = useGetTicketByIdQuery(ticketId, {
    skip: !ticketId
  });
  const { data: messages, isLoading: isMessagesLoading } = useGetTicketMessagesQuery({
    ticketId,
    pageSize: 100,
    pageNumber: 1
  }, {
    skip: !ticketId
  });
  
  const [sendMessage] = useSendTicketMessageMutation();
  const [updateTicketStatus] = useUpdateTicketStatusMutation();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages) {
      setTimeout(scrollToBottom);
    }
  }, [messages]);

  function scrollToBottom() {
    if (!chatRef.current) {
      return;
    }

    chatRef.current.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }

  function isFirstMessageOfGroup(item, i) {
    return i === 0 || (messages[i - 1] && messages[i - 1].senderId !== item.senderId);
  }

  function isLastMessageOfGroup(item, i) {
    return i === messages.length - 1 || (messages[i + 1] && messages[i + 1].senderId !== item.senderId);
  }

  function onInputChange(ev) {
    setMessage(ev.target.value);
  }

  function handleAttachmentAdd(file) {
    setAttachments([...attachments, file]);
  }

  function handleAttachmentRemove(index) {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  }

  async function onMessageSubmit(ev) {
    ev.preventDefault();

    if (message.trim() === '' && attachments.length === 0) {
      return;
    }

    try {
      // First, send the message text
      const result = await sendMessage({
        ticketId,
        message: {
          messageContent: message,
          attachments: []
        }
      }).unwrap();

      // If we have attachments, upload them with the returned message ID
      if (attachments.length > 0 && result.id) {
        const uploadPromises = attachments.map(file => 
          sendMessage({
            ticketId,
            messageId: result.id,
            file
          })
        );
        await Promise.all(uploadPromises);
      }

      // Clear the message and attachments
      setMessage('');
      setAttachments([]);

      // If the ticket is pending and the current user is an admin/employee,
      // update the status to 'ANSWERED'
      // if (
      //   ticket.status === 'PENDING' &&
      //     userAccesses &&
      //     userAccesses.includes('EMPLOYEE_ACCESS')
      // ) {
      //   await updateTicketStatus({
      //     ticketId,
      //     status: 'ANSWERED'
      //   });
      // }
      // // If the ticket status is 'ANSWERED' and the current user is the sender (customer),
      // // update the status to 'PENDING'
      // else if (
      //   ticket.status === 'ANSWERED' &&
      //   user.id === ticket.senderId
      // ) {
      //   await updateTicketStatus({
      //     ticketId,
      //     status: 'PENDING'
      //   });
      // }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }

  const isLoading = isUserLoading || isTicketLoading || isMessagesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <CircularProgress />
      </div>
    );
  }

  if (!user || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Typography variant="h5" color="error">
          تیکت یافت نشد یا شما مجوز برای مشاهده آن را ندارید
        </Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          className="mt-16"
          onClick={() => setMainSidebarOpen(true)}
        >
          بازگشت به لیست تیکت ها
        </Button>
      </div>
    );
  }

  const isAdmin = userAccesses && userAccesses.includes('EMPLOYEE_ACCESS');
  console.log(user)
  return (
    <motion.div 
      className="flex flex-col h-full w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.1 } }}
    >
      <Box
        className="w-full border-b-1"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? lighten(theme.palette.background.default, 0.4)
              : lighten(theme.palette.background.default, 0.02)
        }}
      >
        <Toolbar className="flex items-center justify-between px-16 w-full">
          <div className="flex items-center">
            <IconButton
              aria-label="Open drawer"
              onClick={() => setMainSidebarOpen(true)}
              className="flex lg:hidden"
              size="large"
            >
              <FuseSvgIcon>heroicons-outline:ticket</FuseSvgIcon>
            </IconButton>
            <div className="flex flex-col ml-8">
              <div className="flex items-center">
                <Typography
                  color="inherit"
                  className="text-16 font-semibold"
                >
                  {ticket.subject} 
                </Typography>
                <Typography className="mx-8 text-12 font-medium">
                  ({ticket.ticketRefId})
                </Typography>
              </div>
              <div className="flex items-center mt-4">
                <Chip 
                  size="small"
                  className="ml-8"
                  label={statusLabels[ticket.status] || ticket.status}
                  color={statusColors[ticket.status] || 'default'}
                />
                <Chip 
                  size="small"
                  label={ticket.categoryStr}
                  className="ml-8"
                  variant="outlined"
                />
                <Chip 
                  size="small"
                  label={ticket.departmentStr}
                  className="ml-8"
                  variant="outlined"
                />
              </div>
            </div>
          </div>
          <TicketChatMoreMenu 
            ticket={ticket} 
            isAdmin={isAdmin}
            className="-mx-8" 
          />
        </Toolbar>
      </Box>

      <div className="flex flex-auto h-full min-h-0 w-full">
        <div className="flex flex-1 z-10 flex-col relative w-full">
          <div
            ref={chatRef}
            className="flex flex-1 flex-col overflow-y-auto px-16"
            dir="rtl" // Add RTL direction for Persian language
          >
            {messages?.length > 0 ? (
              <div className="flex flex-col pt-16 pb-40 max-w-3xl mx-auto w-full">
                {messages.map((item, i) => {
                  const isMe = item.senderId === user.id;
                  return (
                    <StyledMessageRow
                      key={item.id}
                      className={clsx(
                        'flex flex-col grow-0 shrink-0 px-16 py-4',
                        isMe ? 'contact' : 'me',
                        { 'first-of-group': isFirstMessageOfGroup(item, i) },
                        { 'last-of-group': isLastMessageOfGroup(item, i) },
                        i + 1 === messages.length && 'mb-96 pb-24' // Extra space at the bottom of the chat
                      )}
                    >
                      {/* Message container with avatar and bubble */}
                      <div className={clsx(
                        'flex items-start mb-4',
                        isMe ? 'flex-row' : 'flex-row-reverse'
                      )}>
                        {/* Avatar */}
                        <Avatar
                          src={item.senderAvatar ? getServerFile(item.senderAvatar) : undefined}
                          alt={item.senderUsername}
                          className={clsx("w-32 h-32", isMe ? "ml-8" : "mr-8")}
                        >
                          {item.senderUsername?.charAt(0)}
                        </Avatar>
                        
                        {/* Message content */}
                        <div className="flex flex-col max-w-3/4" dir="rtl">
                          {/* Sender info - only shown for first message in group */}
                          {isFirstMessageOfGroup(item, i) && (
                            <div className={clsx(
                              "flex items-center mb-4",
                              isMe ? "justify-start" : "justify-end"
                            )}>
                              <Typography className="text-12 font-semibold">
                                {item.senderName || 'Unknown User'}
                              </Typography>
                              <Typography className="text-11 text-gray-500 mx-4">
                                @{item.senderUsername}
                              </Typography>
                            </div>
                          )}
                          
                          {/* Message bubble */}
                          <div className="bubble flex relative flex-col p-12 max-w-xs sm:max-w-md break-words">
                            <div 
                              className="leading-tight"
                              dangerouslySetInnerHTML={{ __html: item.messageContent }}
                            />
                            
                            {/* Attachments */}
                            {item.attachments && item.attachments.length > 0 && (
                              <div className="flex flex-wrap gap-8 mt-8">
                                {item.attachments.map((attachment) => (
                                  <TicketAttachment 
                                    key={attachment.id} 
                                    attachment={attachment} 
                                  />
                                ))}
                              </div>
                            )}
                            
                            {/* Timestamp - now visible below each message */}
                            <Typography
                              className="text-11 mt-4 text-right text-grey-400"
                              // color="text.secondary"
                            >
                              {formatDistanceToNow(new Date(item.createdAt), { 
                                addSuffix: true,
                                locale: faIR 
                              })}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </StyledMessageRow>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col flex-1 items-center justify-center p-24">
                <FuseSvgIcon
                  size={128}
                  color="disabled"
                >
                  heroicons-outline:chat
                </FuseSvgIcon>
                <Typography
                  className="px-16 pb-24 mt-24 text-center"
                  color="text.secondary"
                >
                  با ارسال پیام گفتگو را شروع کنید
                </Typography>
              </div>
            )}
          </div>
          
          {/* Message input area */}
          <Paper
            square
            component="form"
            onSubmit={onMessageSubmit}
            className="absolute border-t-1 bottom-0 right-0 left-0 py-16 px-16"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? lighten(theme.palette.background.default, 0.4)
                  : lighten(theme.palette.background.default, 0.02)
            }}
          >
            {/* Display attached files */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-8 mb-12 max-w-3xl mx-auto" dir="rtl">
                {attachments.map((file, index) => (
                  <Chip
                    key={index}
                    label={file.name}
                    onDelete={() => handleAttachmentRemove(index)}
                    size="small"
                  />
                ))}
              </div>
            )}
            
            <div className="flex items-center relative max-w-3xl mx-auto" dir="rtl">
              <AttachmentUploader onFileSelected={handleAttachmentAdd} />

              <InputBase
                autoFocus={false}
                id="message-input"
                className="flex-1 flex grow shrink-0 h-44 mx-8 px-16 border-2 rounded-full"
                placeholder="پیام خود را بنویسید"
                onChange={onInputChange}
                value={message}
                sx={{ backgroundColor: 'background.paper' }}
                multiline
                maxRows={3}
                dir="rtl"
              />
              
              <IconButton
                type="submit"
                size="large"
                disabled={message.trim() === '' && attachments.length === 0}
              >
                <FuseSvgIcon
                  className="rotate-90"
                  color="action"
                >
                  heroicons-outline:paper-airplane
                </FuseSvgIcon>
              </IconButton>
            </div>
          </Paper>
        </div>
      </div>
    </motion.div>
  );
}

export default TicketChat;