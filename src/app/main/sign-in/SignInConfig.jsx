import authRoles from '../../auth/authRoles';
import SplitScreenSignInPage from '@/app/main/pages/authentication/sign-in/SplitScreenSignInPage.jsx';

const SignInConfig = {
	settings: {
		layout: {
			config: {
				navbar: {
					display: false
				},
				toolbar: {
					display: false
				},
				footer: {
					display: false
				},
				leftSidePanel: {
					display: false
				},
				rightSidePanel: {
					display: false
				}
			}
		}
	},
	auth: authRoles.onlyGuest,
	routes: [
		{
			path: 'sign-in',
			element: <SplitScreenSignInPage />
		}
	]
};
export default SignInConfig;
