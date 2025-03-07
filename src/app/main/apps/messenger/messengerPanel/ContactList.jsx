import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import { motion } from 'framer-motion';
import { memo, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import clsx from 'clsx';
import { Box, CircularProgress } from '@mui/material';
import { selectSelectedContactId, setSelectedContactId, openChatPanel } from './messengerPanelSlice';
import ContactButton from './ContactButton';
import { useGetMessengerChatsQuery, useGetMessengerContactsQuery } from '../MessengerApi';

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

/**
 * The contact payments.
 */
function ContactList(props) {
	const { className } = props;
	const dispatch = useAppDispatch();
	const selectedContactId = useAppSelector(selectSelectedContactId);
	const contactListScroll = useRef(null);
	const { data: chats, isLoading: isChatsLoading } = useGetMessengerChatsQuery();
	const { data: contacts, isLoading: isContactsLoading } = useGetMessengerContactsQuery();
	const chatListContacts = useMemo(() => {
		return contacts?.length > 0 && chats?.length > 0
			? chats.map((_chat) => ({
					..._chat,
					...contacts.find((_contact) => _contact.id === _chat.contactId)
				}))
			: [];
	}, [contacts, chats]);
	const scrollToTop = () => {
		if (!contactListScroll.current) {
			return;
		}

		contactListScroll.current.scrollTop = 0;
	};
	const handleContactClick = (contactId) => {
		dispatch(openChatPanel());
		dispatch(setSelectedContactId(contactId));
		scrollToTop();
	};

	if (isContactsLoading || isChatsLoading) {
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
			ref={contactListScroll}
			option={{ suppressScrollX: true, wheelPropagation: false }}
		>
			{contacts?.length > 0 && (
				<motion.div
					variants={container}
					initial="hidden"
					animate="show"
					className="flex flex-col shrink-0"
				>
					{chatListContacts &&
						chatListContacts.map((contact) => {
							return (
								<motion.div
									variants={item}
									key={contact.id}
								>
									<ContactButton
										contact={contact}
										selectedContactId={selectedContactId}
										onClick={handleContactClick}
									/>
								</motion.div>
							);
						})}
					<Divider className="mx-24 my-8" />
					{contacts.map((contact) => {
						const chatContact = chats.find((_chat) => _chat.contactId === contact.id);
						return !chatContact ? (
							<motion.div
								variants={item}
								key={contact.id}
							>
								<ContactButton
									contact={contact}
									selectedContactId={selectedContactId}
									onClick={handleContactClick}
								/>
							</motion.div>
						) : null;
					})}
				</motion.div>
			)}
		</Root>
	);
}

export default memo(ContactList);
