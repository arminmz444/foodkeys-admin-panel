import FusePageCarded from '@fuse/core/FusePageCarded/index.js';
import { useThemeMediaQuery } from '@fuse/hooks/index.js';
import CompaniesHeader from './CompaniesHeader.jsx';
import CompaniesTable from './CompaniesTable.jsx';

/**
 * The companies page.
 */
function Companies() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	return (
		// <>
		// 	<GlobalStyles
		// 		styles={() => ({
		// 			'#root': {
		// 				maxHeight: '100vh'
		// 			}
		// 		})}
		// 	/>
		// 	<div className="w-full h-full container flex flex-col">
		// 		<CompaniesHeader />
		// 		<CompaniesTable />
		// 	</div>
		// </>
		<FusePageCarded
			header={<CompaniesHeader />}
			content={<CompaniesTable />}
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default Companies;
