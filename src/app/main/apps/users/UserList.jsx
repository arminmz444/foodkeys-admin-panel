import GlobalStyles from '@mui/material/GlobalStyles';
import UserHeader from './UserHeader.jsx';
import UserTable from './UserTable.jsx';

/**
 * The companies page.
 */
function UserList() {
	return (
		<>
			<GlobalStyles
				styles={() => ({
					'#root': {
						maxHeight: '100vh'
					}
				})}
			/>
			<div className="w-full h-full container flex flex-col">
				<UserHeader />
				<UserTable />
			</div>
		</>
	);
}

export default UserList;
