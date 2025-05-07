// import { lighten, styled } from '@mui/material/styles';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import clsx from 'clsx';
// import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
// import { useContext, useEffect, useRef, useState } from 'react';
// import InputBase from '@mui/material/InputBase';
// import Paper from '@mui/material/Paper';
// import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
// import Toolbar from '@mui/material/Toolbar';
// import { useParams } from 'react-router-dom';
// import Box from '@mui/material/Box';
// import UserAvatar from '../UserAvatar';
// import ChatMoreMenu from './ChatMoreMenu';
// import { ChatAppContext } from '../TicketingApp.jsx';
// import Error404Page from '../../../404/Error404Page';
// import {
// 	useGetTicketingChatQuery,
// 	useGetTicketingContactQuery,
// 	useGetTicketingUserProfileQuery,
// 	useSendTicketingMessageMutation
// } from '../TicketingApi.js';

// const StyledMessageRow = styled('div')(({ theme }) => ({
// 	'&.contact': {
// 		'& .bubble': {
// 			backgroundColor: lighten(theme.palette.secondary.main, 0.1),
// 			color: theme.palette.secondary.contrastText,
// 			borderTopLeftRadius: 5,
// 			borderBottomLeftRadius: 5,
// 			borderTopRightRadius: 20,
// 			borderBottomRightRadius: 20,
// 			'& .time': {
// 				marginLeft: 12
// 			}
// 		},
// 		'&.first-of-group': {
// 			'& .bubble': {
// 				borderTopLeftRadius: 20
// 			}
// 		},
// 		'&.last-of-group': {
// 			'& .bubble': {
// 				borderBottomLeftRadius: 20
// 			}
// 		}
// 	},
// 	'&.me': {
// 		paddingLeft: 40,
// 		'& .bubble': {
// 			marginLeft: 'auto',
// 			backgroundColor: lighten(theme.palette.primary.main, 0.1),
// 			color: theme.palette.primary.contrastText,
// 			borderTopLeftRadius: 20,
// 			borderBottomLeftRadius: 20,
// 			borderTopRightRadius: 5,
// 			borderBottomRightRadius: 5,
// 			'& .time': {
// 				justifyContent: 'flex-end',
// 				right: 0,
// 				marginRight: 12
// 			}
// 		},
// 		'&.first-of-group': {
// 			'& .bubble': {
// 				borderTopRightRadius: 20
// 			}
// 		},
// 		'&.last-of-group': {
// 			'& .bubble': {
// 				borderBottomRightRadius: 20
// 			}
// 		}
// 	},
// 	'&.contact + .me, &.me + .contact': {
// 		paddingTop: 20,
// 		marginTop: 20
// 	},
// 	'&.first-of-group': {
// 		'& .bubble': {
// 			borderTopLeftRadius: 20,
// 			paddingTop: 13
// 		}
// 	},
// 	'&.last-of-group': {
// 		'& .bubble': {
// 			borderBottomLeftRadius: 20,
// 			paddingBottom: 13,
// 			'& .time': {
// 				display: 'flex'
// 			}
// 		}
// 	}
// }));

// /**
//  * The Chat App.
//  */
// function Chat(props) {
// 	const { className } = props;
// 	const { setMainSidebarOpen, setContactSidebarOpen } = useContext(ChatAppContext);
// 	const chatRef = useRef(null);
// 	const [message, setMessage] = useState('');
// 	const routeParams = useParams();
// 	const contactId = routeParams.id;
// 	const { data: user } = useGetTicketingUserProfileQuery();
// 	const { data: chat } = useGetTicketingChatQuery(contactId, {
// 		skip: !contactId
// 	});
// 	const { data: selectedContact } = useGetTicketingContactQuery(contactId, {
// 		skip: !contactId
// 	});
// 	const [sendMessage] = useSendTicketingMessageMutation();
// 	useEffect(() => {
// 		if (chat) {
// 			setTimeout(scrollToBottom);
// 		}
// 	}, [chat]);

// 	function scrollToBottom() {
// 		if (!chatRef.current) {
// 			return;
// 		}

// 		chatRef.current.scrollTo({
// 			top: chatRef.current.scrollHeight,
// 			behavior: 'smooth'
// 		});
// 	}

// 	function isFirstMessageOfGroup(item, i) {
// 		return i === 0 || (chat[i - 1] && chat[i - 1].contactId !== item.contactId);
// 	}

// 	function isLastMessageOfGroup(item, i) {
// 		return i === chat.length - 1 || (chat[i + 1] && chat[i + 1].contactId !== item.contactId);
// 	}

// 	function onInputChange(ev) {
// 		setMessage(ev.target.value);
// 	}

// 	function onMessageSubmit(ev) {
// 		ev.preventDefault();

// 		if (message === '') {
// 			return;
// 		}

// 		sendMessage({
// 			message,
// 			contactId
// 		});
// 		setMessage('');
// 	}

// 	if (!user || !chat || !selectedContact) {
// 		return <Error404Page />;
// 	}

// 	return (
// 		<>
// 			<Box
// 				className="w-full border-b-1"
// 				sx={{
// 					backgroundColor: (theme) =>
// 						theme.palette.mode === 'light'
// 							? lighten(theme.palette.background.default, 0.4)
// 							: lighten(theme.palette.background.default, 0.02)
// 				}}
// 			>
// 				<Toolbar className="flex items-center justify-between px-16 w-full">
// 					<div className="flex items-center">
// 						<IconButton
// 							aria-label="Open drawer"
// 							onClick={() => setMainSidebarOpen(true)}
// 							className="flex lg:hidden"
// 							size="large"
// 						>
// 							<FuseSvgIcon>heroicons-outline:chat</FuseSvgIcon>
// 						</IconButton>
// 						<div
// 							className="flex items-center cursor-pointer"
// 							onClick={() => {
// 								setContactSidebarOpen(true);
// 							}}
// 							onKeyDown={() => setContactSidebarOpen(true)}
// 							role="button"
// 							tabIndex={0}
// 						>
// 							<UserAvatar
// 								className="relative mx-8"
// 								user={selectedContact}
// 							/>
// 							<Typography
// 								color="inherit"
// 								className="text-16 font-semibold px-4"
// 							>
// 								{selectedContact.name}
// 							</Typography>
// 						</div>
// 					</div>
// 					<ChatMoreMenu className="-mx-8" />
// 				</Toolbar>
// 			</Box>

// 			<div className="flex flex-auto h-full min-h-0 w-full">
// 				<div className={clsx('flex flex-1 z-10 flex-col relative', className)}>
// 					<div
// 						ref={chatRef}
// 						className="flex flex-1 flex-col overflow-y-auto"
// 					>
// 						{chat?.length > 0 && (
// 							<div className="flex flex-col pt-16 px-16 pb-40">
// 								{chat.map((item, i) => {
// 									return (
// 										<StyledMessageRow
// 											key={i}
// 											className={clsx(
// 												'flex flex-col grow-0 shrink-0 items-start justify-end relative px-16 pb-4',
// 												item.contactId === user.id ? 'me' : 'contact',
// 												{ 'first-of-group': isFirstMessageOfGroup(item, i) },
// 												{ 'last-of-group': isLastMessageOfGroup(item, i) },
// 												i + 1 === chat.length && 'pb-96'
// 											)}
// 										>
// 											<div className="bubble flex relative items-center justify-center p-12 max-w-full">
// 												<div className="leading-tight whitespace-pre-wrap">{item.value}</div>
// 												<Typography
// 													className="time absolute hidden w-full text-11 mt-8 -mb-24 ltr:left-0 rtl:right-0 bottom-0 whitespace-nowrap"
// 													color="text.secondary"
// 												>
// 													{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
// 												</Typography>
// 											</div>
// 										</StyledMessageRow>
// 									);
// 								})}
// 							</div>
// 						)}
// 					</div>
// 					{chat && (
// 						<Paper
// 							square
// 							component="form"
// 							onSubmit={onMessageSubmit}
// 							className="absolute border-t-1 bottom-0 right-0 left-0 py-16 px-16"
// 							sx={{
// 								backgroundColor: (theme) =>
// 									theme.palette.mode === 'light'
// 										? lighten(theme.palette.background.default, 0.4)
// 										: lighten(theme.palette.background.default, 0.02)
// 							}}
// 						>
// 							<div className="flex items-center relative">
// 								<IconButton
// 									type="submit"
// 									size="large"
// 								>
// 									<FuseSvgIcon
// 										className="text-24"
// 										color="action"
// 									>
// 										heroicons-outline:emoji-happy
// 									</FuseSvgIcon>
// 								</IconButton>

// 								<IconButton
// 									type="submit"
// 									size="large"
// 								>
// 									<FuseSvgIcon
// 										className="text-24"
// 										color="action"
// 									>
// 										heroicons-outline:paper-clip
// 									</FuseSvgIcon>
// 								</IconButton>

// 								<InputBase
// 									autoFocus={false}
// 									id="message-input"
// 									className="flex-1 flex grow shrink-0 h-44 mx-8 px-16 border-2 rounded-full"
// 									placeholder="Type your message"
// 									onChange={onInputChange}
// 									value={message}
// 									sx={{ backgroundColor: 'background.paper' }}
// 								/>
// 								<IconButton
// 									type="submit"
// 									size="large"
// 								>
// 									<FuseSvgIcon
// 										className="rotate-90"
// 										color="action"
// 									>
// 										heroicons-outline:paper-airplane
// 									</FuseSvgIcon>
// 								</IconButton>
// 							</div>
// 						</Paper>
// 					)}
// 				</div>
// 			</div>
// 		</>
// 	);
// }

// export default Chat;
import { lighten, styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
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
import { Button, Chip, CircularProgress } from '@mui/material';
import AttachmentUploader from './AttachmentUploader';
import TicketAttachment from './TicketAttachment';
import { motion } from 'framer-motion';

const StyledMessageRow = styled('div')(({ theme }) => ({
  '&.contact': {
    '& .bubble': {
      backgroundColor: lighten(theme.palette.secondary.main, 0.1),
      color: theme.palette.secondary.contrastText,
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
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
  '&.me': {
    paddingLeft: 40,
    '& .bubble': {
      marginLeft: 'auto',
      backgroundColor: lighten(theme.palette.primary.main, 0.1),
      color: theme.palette.primary.contrastText,
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
      borderTopRightRadius: 5,
      borderBottomRightRadius: 5,
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
  '&.contact + .me, &.me + .contact': {
    paddingTop: 20,
    marginTop: 20
  },
  '&.first-of-group': {
    '& .bubble': {
      borderTopLeftRadius: 20,
      paddingTop: 13
    }
  },
  '&.last-of-group': {
    '& .bubble': {
      borderBottomLeftRadius: 20,
      paddingBottom: 13,
      '& .time': {
        display: 'flex'
      }
    }
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
  'PENDING': 'Pending',
  'IN_PROGRESS': 'In Progress',
  'ANSWERED': 'Answered',
  'CLOSED': 'Closed'
};

function TicketChat() {
  const { setMainSidebarOpen, setContactSidebarOpen } = useContext(TicketAppContext);
  const chatRef = useRef(null);
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const routeParams = useParams();
  const ticketId = routeParams.id;
  const { data: user, isLoading: isUserLoading } = useGetUserProfileQuery();
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
      if (
        ticket.status === 'PENDING' && 
        user.hasAccess && 
        user.hasAccess.includes('EMPLOYEE_ACCESS')
      ) {
        await updateTicketStatus({
          ticketId,
          status: 'ANSWERED'
        });
      }
      // If the ticket status is 'ANSWERED' and the current user is the sender (customer),
      // update the status to 'PENDING'
      else if (
        ticket.status === 'ANSWERED' && 
        user.id === ticket.senderId
      ) {
        await updateTicketStatus({
          ticketId,
          status: 'PENDING'
        });
      }
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

  const isAdmin = user.hasAccess && user.hasAccess.includes('EMPLOYEE_ACCESS');

  return (
    <motion.div 
      className="flex flex-col h-full"
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
                  (#{ticket.ticketRefId})
                </Typography>
              </div>
              <div className="flex items-center mt-4">
                <Chip 
                  size="small"
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
            className="flex flex-1 flex-col overflow-y-auto"
          >
            {messages?.length > 0 ? (
              <div className="flex flex-col pt-16 px-16 pb-40">
                {messages.map((item, i) => {
                  const isMe = item.senderId === user.id;
                  return (
                    <StyledMessageRow
                      key={item.id}
                      className={clsx(
                        'flex flex-col grow-0 shrink-0 items-start justify-end relative px-16 pb-4',
                        isMe ? 'me' : 'contact',
                        { 'first-of-group': isFirstMessageOfGroup(item, i) },
                        { 'last-of-group': isLastMessageOfGroup(item, i) },
                        i + 1 === messages.length && 'pb-96'
                      )}
                    >
                      <div className="bubble flex relative flex-col items-start justify-center p-12 max-w-full">
                        {!isMe && isFirstMessageOfGroup(item, i) && (
                          <Typography className="text-12 font-semibold mb-4">
                            {item.senderName || 'Unknown User'}
                          </Typography>
                        )}
                        <div className="leading-tight whitespace-pre-wrap">{item.messageContent}</div>
                        
                        {/* Render attachments if any */}
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
                        
                        <Typography
                          className="time absolute hidden w-full text-11 mt-8 -mb-24 ltr:left-0 rtl:right-0 bottom-0 whitespace-nowrap"
                          color="text.secondary"
                        >
                          {formatDistanceToNow(new Date(item.createdAtStr || item.createdAt), { addSuffix: true })}
                        </Typography>
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
                  Start the conversation by sending your first message.
                </Typography>
              </div>
            )}
          </div>
          
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
              <div className="flex flex-wrap gap-8 mb-12">
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
            
            <div className="flex items-center relative">
              <AttachmentUploader onFileSelected={handleAttachmentAdd} />

              <InputBase
                autoFocus={false}
                id="message-input"
                className="flex-1 flex grow shrink-0 h-44 mx-8 px-16 border-2 rounded-full"
                placeholder="Type your message"
                onChange={onInputChange}
                value={message}
                sx={{ backgroundColor: 'background.paper' }}
                multiline
                maxRows={3}
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