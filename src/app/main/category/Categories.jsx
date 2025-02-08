import { useThemeMediaQuery } from '@fuse/hooks/index.js';
import FusePageCarded from '@fuse/core/FusePageCarded/index.js';
import CategoriesHeader from './CategoriesHeader.jsx';
import CategoriesTable from './CategoriesTable.jsx';

/**
 * The Categories page.
 */
function Categories() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	return (
		<FusePageCarded
			header={<CategoriesHeader />}
			content={<CategoriesTable />}
			scroll={isMobile ? 'normal' : 'content'}
		/>
		// <>
		// 	<GlobalStyles
		// 		styles={() => ({
		// 			'#root': {
		// 				maxHeight: '100vh'
		// 			}
		// 		})}
		// 	/>
		// 	<div className="w-full h-full container flex flex-col">
		// 		<CategoriesHeader />
		// 		<CategoriesTable />
		// 	</div>
		// </>
	);
}

export default Categories;
