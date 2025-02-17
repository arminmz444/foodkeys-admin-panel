import { useThemeMediaQuery } from '@fuse/hooks/index.js';
import FusePageCarded from '@fuse/core/FusePageCarded/index.js';
import BundlesHeader from './BundlesHeader.jsx';
import BundlesTable from './BundlesTable';

/**
 * The Bundles page.
 */
function Bundles() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	return (
		<FusePageCarded
			header={<BundlesHeader />}
			content={<BundlesTable />}
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

export default Bundles;
