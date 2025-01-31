import AcademyAppConfig from './academy/AcademyAppConfig';
import CalendarAppConfig from './calendar/CalendarAppConfig';
import MessengerAppConfig from './messenger/MessengerAppConfig';
import ContactsAppConfig from './contacts/ContactsAppConfig';
import ECommerceAppConfig from './e-commerce/ECommerceAppConfig';
import FileManagerAppConfig from './file-manager/FileManagerAppConfig';
import HelpCenterAppConfig from './help-center/HelpCenterAppConfig';
import MailboxAppConfig from './mailbox/MailboxAppConfig';
import NotesAppConfig from './notes/NotesAppConfig';
import ProfileAppConfig from './profile/profileAppConfig';
import ScrumboardAppConfig from './scrumboard/ScrumboardAppConfig';
import TasksAppConfig from './tasks/TasksAppConfig';
import NotificationsAppConfig from './notifications/NotificationsAppConfig';
import SettingsAppConfig from './settings/SettingsAppConfig';
import UserAppConfig from '@/app/main/apps/users/UserAppConfig.jsx';
/**
 * The payments of application configurations.
 */
const appsConfigs = [
	AcademyAppConfig,
	CalendarAppConfig,
	MessengerAppConfig,
	ContactsAppConfig,
	ECommerceAppConfig,
	FileManagerAppConfig,
	HelpCenterAppConfig,
	MailboxAppConfig,
	NotesAppConfig,
	ProfileAppConfig,
	ScrumboardAppConfig,
	TasksAppConfig,
	NotificationsAppConfig,
	SettingsAppConfig,
	UserAppConfig
];
export default appsConfigs;