import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { useParams } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import { useAppSelector } from 'app/store/hooks';
import DetailSidebarContent from './DetailSidebarContent';
import FileManagerHeader from './FileManagerHeader';
import FileManagerList from './FileManagerList';
import { useGetFileManagerFolderQuery } from './FileManagerApi';
import { selectSelectedItemId } from './fileManagerAppSlice';
import { selectUser } from '../../../auth/user/store/userSlice';

/**
 * The file manager app.
 */
function FileManagerApp() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const routeParams = useParams();
	const user = useAppSelector(selectUser);
	const username = user.username ? user.username : '09144226139';
	const { folderId } = routeParams || username;
	const { data, isLoading } = useGetFileManagerFolderQuery(folderId);
	console.log(data);
	const selectedItemId = useAppSelector(selectSelectedItemId);
	const selectedItem = _.find(data?.items, { id: selectedItemId });
	const folders = _.filter(data?.items, { type: 'folder' });
	const files = _.reject(data?.items, { type: 'folder' });
	const path = data?.path;
	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<FusePageCarded
			header={
				<FileManagerHeader
					path={path}
					folders={folders}
					files={files}
				/>
			}
			content={
				<FileManagerList
					folders={folders}
					files={files}
				/>
			}
			rightSidebarOpen={Boolean(selectedItem)}
			rightSidebarContent={
				<div className="w-full">
					<DetailSidebarContent items={data?.items} />
				</div>
			}
			rightSidebarWidth={400}
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default FileManagerApp;
