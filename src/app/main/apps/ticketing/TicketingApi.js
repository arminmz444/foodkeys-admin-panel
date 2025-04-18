import { apiService as api } from 'app/store/apiService';

export const addTagTypes = [
	'ticketing_contacts',
	'ticketing_contact',
	'ticketing_chats',
	'ticketing_chat',
	'ticketing_user_profile'
];
const TicketingApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getTicketingContacts: build.query({
				query: () => ({ url: `/mock-api/ticketing/contacts` }),
				providesTags: ['ticketing_contacts']
			}),
			getTicketingContact: build.query({
				query: (queryArg) => ({ url: `/mock-api/ticketing/contacts/${queryArg}` }),
				providesTags: ['ticketing_contact']
			}),
			updateTicketingContact: build.mutation({
				query: (queryArg) => ({
					url: `/mock-api/ticketing/contacts/${queryArg.id}`,
					method: 'PUT',
					data: queryArg
				}),
				invalidatesTags: ['ticketing_contact']
			}),
			deleteTicketingContact: build.mutation({
				query: (queryArg) => ({
					url: `/mock-api/ticketing/contacts/${queryArg}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['ticketing_contact']
			}),
			getTicketingChats: build.query({
				query: () => ({ url: `/mock-api/ticketing/chats` }),
				providesTags: ['ticketing_chats']
			}),
			getTicketingChat: build.query({
				query: (queryArg) => ({ url: `/mock-api/ticketing/chats/${queryArg}` }),
				providesTags: ['ticketing_chat']
			}),
			deleteTicketingChat: build.mutation({
				query: (queryArg) => ({
					url: `/mock-api/ticketing/chats/${queryArg}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['ticketing_chats']
			}),
			sendTicketingMessage: build.mutation({
				query: (queryArg) => ({
					url: `/mock-api/ticketing/chats/${queryArg.contactId}`,
					method: 'POST',
					data: queryArg.message
				}),
				invalidatesTags: ['ticketing_chat', 'ticketing_chats']
			}),
			getTicketingUserProfile: build.query({
				query: () => ({ url: `/mock-api/ticketing/profile` }),
				providesTags: ['ticketing_user_profile']
			}),
			updateTicketingUserProfile: build.mutation({
				query: (queryArg) => ({
					url: `/mock-api/ticketing/profile`,
					method: 'PUT',
					data: queryArg
				}),
				invalidatesTags: ['ticketing_user_profile']
			})
		}),
		overrideExisting: false
	});
export default TicketingApi;
export const {
	useGetTicketingContactsQuery,
	useGetTicketingContactQuery,
	useUpdateTicketingContactMutation,
	useDeleteTicketingContactMutation,
	useGetTicketingChatsQuery,
	useGetTicketingChatQuery,
	useDeleteTicketingChatMutation,
	useGetTicketingUserProfileQuery,
	useUpdateTicketingUserProfileMutation,
	useSendTicketingMessageMutation
} = TicketingApi;
