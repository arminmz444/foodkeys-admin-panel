// import _ from '@lodash';
// import FuseUtils from '@fuse/utils';
// import NotificationModel from 'src/app/main/apps/notification/models/NotificationModel';
// import mockApi from '../mock-api.json';
//
// let notificationsDB = mockApi.components.examples.notifications.value;
// export const notificationsApiMocks = (mock) => {
// 	mock.onGet('/notifications').reply(() => [200, notificationsDB]);
// 	mock.onDelete('/notifications').reply(() => {
// 		notificationsDB = [];
// 		return [200];
// 	});
// 	mock.onPost('/notifications').reply((config) => {
// 		const newNotification = NotificationModel({
// 			id: FuseUtils.generateGUID(),
// 			...JSON.parse(config.data)
// 		});
// 		notificationsDB.push(newNotification);
// 		return [200, newNotification];
// 	});
// 	mock.onDelete('/notification/:id').reply((config) => {
// 		const { id } = config.params;
// 		_.remove(notificationsDB, { id });
// 		return [200, id];
// 	});
// };

// notificationsApi.js
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { addTagTypes } from '@/app/main/apps/notification/NotificationApi.js';

/**
 * This is the base RTK Query API slice.
 * We'll define multiple endpoints for notifications here.
 */
import { apiService as api } from 'app/store/apiService';
import WebSocket from 'ws';

export const addTagTypes = ['notifications', 'notification'];
const notificationsApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (builder) => ({
			getUserNotifications: builder.query({
				query: (userId) => `notification/user/${userId}`,
				providesTags: (result, error, arg) =>
					result
						? [
								...result.map((n) => ({ type: 'notification', id: n.id })),
								{ type: 'notification', id: 'LIST' }
							]
						: [{ type: 'notification', id: 'LIST' }]
			}),

			// 2) Admin streaming notifications
			getAdminNotifications: builder.query({
				// The initial fetch to load existing notifications
				query: () => `notification/admin`, // Adjust endpoint as needed
				// Now we add the streaming logic with onCacheEntryAdded
				async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
					// We'll open a WebSocket to receive new admin notifications in real-time
					const ws = new WebSocket('ws://localhost:8080/ws');

					try {
						// Wait until the initial query data is in cache before processing updates
						await cacheDataLoaded;

						// Set up a listener for incoming WebSocket messages
						const listener = (event) => {
							const data = JSON.parse(event.data);

							// Suppose your Spring Boot sends notifications in the same shape
							// E.g.: { id, title, description, ... }

							// Update the query cache with the newly received notification
							updateCachedData((draft) => {
								// If it's a new notification, add to the front or back of the array
								draft.unshift(data);
							});
						};

						ws.addEventListener('message', listener);
					} catch (err) {
						// If cacheEntryRemoved resolves before cacheDataLoaded,
						// we abort our setup since the query is no longer subscribed
					}

					// When the caller unsubscribes or component unmounts, close the socket
					await cacheEntryRemoved;
					ws.close();
				},
				// We can add providesTags or transformResponse if needed
				providesTags: (result, error, arg) =>
					result
						? [
								...result.map((notif) => ({ type: 'notification', id: notif.id })),
								{ type: 'notification', id: 'LIST' }
							]
						: [{ type: 'notification', id: 'LIST' }]
			}),

			// 3) Mutation to mark notification as read
			markNotificationAsRead: builder.mutation({
				query: (notificationId) => ({
					url: `notification/${notificationId}/read`,
					method: 'PUT'
				}),
				invalidatesTags: (result, error, arg) => [{ type: 'notification', id: arg }]
			}),

			// 4) Mutation to create a notification
			// If admin is creating or you have some logic for it, you can define it here
			createNotification: builder.mutation({
				query: (newNotif) => ({
					url: `notification/create`,
					method: 'POST',
					body: newNotif
				}),
				invalidatesTags: [{ type: 'notification', id: 'LIST' }]
			})
		})
	});

export const {
	useGetUserNotificationsQuery,
	useGetAdminNotificationsQuery,
	useMarkNotificationAsReadMutation,
	useCreateNotificationMutation
} = notificationsApi;
