/* eslint import/no-extraneous-dependencies: off */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import NotificationModel from './NotificationModel.js';

/**
 * Example async thunk for fetching notifications.
 * You might call this periodically, or when navigating to the notifications page.
 * Adjust '/api/notifications' to match your actual endpoint.
 */
export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', async () => {
	const response = await axios.get('/api/notifications');
	return response.data; // Make sure the response shape matches your slice
});

/**
 * Example async thunk for marking a notification as read.
 * This sends a request to your Node service or directly to the Spring Boot API,
 * depending on your architecture. Adapt the endpoint as needed.
 */
export const markNotificationAsRead = createAsyncThunk(
	'notifications/markNotificationAsRead',
	async (notificationId) => {
		await axios.post(`/api/notifications/${notificationId}/read`);
		// Return the ID so we can update the local state
		return notificationId;
	}
);

/**
 * Initial notifications state.
 * You can preload it with the JSON you provided, or keep it empty and load everything
 * from the server on app start / user login / poll, etc.
 */
// const initialState = {
// 	data: [
// 		{
// 			id: '493190c9-5b61-4912-afe5-78c21f1044d7',
// 			icon: 'heroicons-solid:star',
// 			title: 'Daily challenges',
// 			description: 'Your submission has been accepted',
// 			time: '2022-05-09T10:32:42.703Z',
// 			read: false,
// 			variant: 'default',
// 			link: '/dashboards/project',
// 			useRouter: true
// 		},
// 		{
// 			id: '6e3e97e5-effc-4fb7-b730-52a151f0b641',
// 			image: 'assets/images/avatars/male-04.jpg',
// 			description:
// 				'<strong>Leo Gill</strong> added you to <em>Top Secret Project</em> group and assigned you as a <em>Project Manager</em>',
// 			time: '2022-05-09T10:07:42.703Z',
// 			read: true,
// 			variant: 'default',
// 			link: '/dashboards/project',
// 			useRouter: true
// 		},
// 		{
// 			id: 'b91ccb58-b06c-413b-b389-87010e03a120',
// 			icon: 'heroicons-solid:mail',
// 			title: 'Mailbox',
// 			description: 'You have 15 unread mails across 3 mailboxes',
// 			time: '2022-05-09T07:57:42.703Z',
// 			read: false,
// 			variant: 'default',
// 			link: '/apps/mailbox',
// 			useRouter: true
// 		},
// 		{
// 			id: '541416c9-84a7-408a-8d74-27a43c38d797',
// 			icon: 'heroicons-solid:refresh',
// 			title: 'Cron jobs',
// 			description: 'Your <em>Docker container</em> is ready to publish',
// 			time: '2022-05-09T05:57:42.703Z',
// 			read: false,
// 			variant: 'default',
// 			link: '/dashboards/project',
// 			useRouter: true
// 		},
// 		{
// 			id: 'ef7b95a7-8e8b-4616-9619-130d9533add9',
// 			image: 'assets/images/avatars/male-06.jpg',
// 			description: '<strong>Roger Murray</strong> accepted your friend request',
// 			time: '2022-05-09T03:57:42.703Z',
// 			read: true,
// 			variant: 'default',
// 			link: '/dashboards/project',
// 			useRouter: true
// 		},
// 		{
// 			id: 'eb8aa470-635e-461d-88e1-23d9ea2a5665',
// 			image: 'assets/images/avatars/female-04.jpg',
// 			description: '<strong>Sophie Stone</strong> sent you a direct message',
// 			time: '2022-05-09T01:57:42.703Z',
// 			read: true,
// 			variant: 'default',
// 			link: '/dashboards/project',
// 			useRouter: true
// 		},
// 		{
// 			id: 'b85c2338-cc98-4140-bbf8-c226ce4e395e',
// 			icon: 'heroicons-solid:mail',
// 			title: 'Mailbox',
// 			description: 'You have 3 new mails',
// 			time: '2022-05-08T10:57:42.703Z',
// 			read: true,
// 			variant: 'default',
// 			link: '/apps/mailbox',
// 			useRouter: true
// 		},
// 		{
// 			id: '8f8e1bf9-4661-4939-9e43-390957b60f42',
// 			icon: 'heroicons-solid:star',
// 			title: 'Daily challenges',
// 			description:
// 				'Your submission has been accepted and you are ready to sign-up for the final assigment which will be ready in 2 days',
// 			time: '2022-05-06T10:57:42.703Z',
// 			read: true,
// 			variant: 'default',
// 			link: '/dashboards/project',
// 			useRouter: true
// 		},
// 		{
// 			id: '30af917b-7a6a-45d1-822f-9e7ad7f8bf69',
// 			icon: 'heroicons-solid:refresh',
// 			title: 'Cron jobs',
// 			description: 'Your Vagrant container is ready to download',
// 			time: '2022-05-05T10:57:42.703Z',
// 			read: true,
// 			variant: 'default',
// 			link: '/apps/file-manager',
// 			useRouter: true
// 		}
// 	],
// 	loading: false,
// 	error: null
// };
const initialState = {
	data: [
		{
			id: '1',
			icon: 'heroicons-solid:briefcase',
			title: 'وظیفه جدید',
			description: 'به شما یک وظیفه جدید اختصاص داده شده است.',
			time: '2022-10-10T08:30:00.000Z',
			read: false,
			variant: 'default',
			link: '/dashboard/tasks',
			useRouter: true
		},
		{
			id: '2',
			icon: 'heroicons-solid:calendar',
			title: 'یادآوری جلسه',
			description: 'جلسه تیمی امروز در ساعت ۱۴ برگزار می‌شود.',
			time: '2022-10-10T07:00:00.000Z',
			read: false,
			variant: 'default',
			link: '/dashboard/calendar',
			useRouter: true
		},
		{
			id: '3',
			icon: 'heroicons-solid:document',
			title: 'سند جدید',
			description: 'یک سند جدید برای بررسی در سامانه موجود است.',
			time: '2022-10-09T15:45:00.000Z',
			read: true,
			variant: 'default',
			link: '/dashboard/documents',
			useRouter: true
		},
		{
			id: '4',
			icon: 'heroicons-solid:refresh',
			title: 'به‌روزرسانی سیستم',
			description: 'سیستم با موفقیت به‌روزرسانی شد.',
			time: '2022-10-09T12:00:00.000Z',
			read: false,
			variant: 'default',
			link: '/dashboard/system',
			useRouter: true
		},
		{
			id: '5',
			image: 'assets/images/avatars/admin.jpg',
			title: 'پیام مستقیم',
			description: '<strong>مدیر</strong> برای شما پیامی ارسال کرده است.',
			time: '2022-10-09T10:20:00.000Z',
			read: true,
			variant: 'default',
			link: '/dashboard/messages',
			useRouter: true
		},
		{
			id: '6',
			icon: 'heroicons-solid:download',
			title: 'فایل آماده دانلود',
			description: 'فایل جدید از بخش مدیریت برای دانلود آماده است.',
			time: '2022-10-09T09:00:00.000Z',
			read: false,
			variant: 'default',
			link: '/dashboard/files',
			useRouter: true
		},
		{
			id: '7',
			icon: 'heroicons-solid:information-circle',
			title: 'تغییرات سیاست‌ها',
			description: 'سیاست‌های جدید شرکت منتشر شده‌اند.',
			time: '2022-10-08T16:30:00.000Z',
			read: true,
			variant: 'default',
			link: '/dashboard/policies',
			useRouter: true
		},
		{
			id: '8',
			icon: 'heroicons-solid:exclamation',
			title: 'خطا در ورود',
			description: 'خطایی در ورود به سیستم شناسایی شده است.',
			time: '2022-10-08T08:15:00.000Z',
			read: true,
			variant: 'default',
			link: '/dashboard/errors',
			useRouter: true
		}
	],
	loading: false,
	error: null
};

/**
 * The notifications slice
 */
export const notificationsSlice = createSlice({
	name: 'notifications',
	initialState,
	reducers: {
		/**
		 * Add a new notification to the top of the list.
		 * Useful if you receive data via WebSocket and want to update state immediately.
		 */
		addNotification: (state, action) => {
			const notifications = action.payload;

			// You can also check for duplicates, if necessary
			if (notifications) {
				if (Array.isArray(notifications) && notifications.length > 0)
					for (let i = 0; i < notifications.length; i++)
						state.data.unshift(new NotificationModel(notifications[i]));
				else state.data.unshift(new NotificationModel(notifications));
			}
		},
		/**
		 * Mark a specific notification as read (local only).
		 * If you don't need a server round-trip for this, you can call this directly.
		 * Otherwise, you'll rely on the markNotificationAsRead async thunk above.
		 */
		localMarkNotificationAsRead: (state, action) => {
			const notificationId = action.payload;
			const index = state.data.findIndex((n) => n.id === notificationId);

			if (index !== -1) {
				state.data[index].read = true;
			}
		},
		/**
		 * Mark all notifications as read (local only).
		 * If your backend needs to mark all as read, create another async thunk.
		 */
		markAllAsRead: (state) => {
			state.data.forEach((notification) => {
				notification.read = true;
			});
		}
	},
	extraReducers: (builder) => {
		builder
			/**
			 * fetchNotifications Thunk
			 */
			.addCase(fetchNotifications.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchNotifications.fulfilled, (state, action) => {
				state.loading = false;
				state.data = action.payload; // Update with new notifications
			})
			.addCase(fetchNotifications.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			/**
			 * markNotificationAsRead Thunk
			 */
			.addCase(markNotificationAsRead.fulfilled, (state, action) => {
				// 'action.payload' is the notificationId returned from the thunk
				const notificationId = action.payload;
				const index = state.data.findIndex((n) => n.id === notificationId);

				if (index !== -1) {
					state.data[index].read = true;
				}
			});
	}
});

/**
 * Export the actions
 */
export const { addNotification, localMarkNotificationAsRead, markAllAsRead } = notificationsSlice.actions;

/**
 * Export selector(s) for accessing notifications in components
 */
export const selectNotifications = (state) => state?.notifications?.data;
export const selectUnreadCount = (state) => state?.notifications?.data?.filter((n) => !n.read)?.length;

/**
 * Export the reducer to add to your store
 */
export default notificationsSlice.reducer;
