import GlobalStyles from '@mui/material/GlobalStyles';
import CategoriesHeader from './CategoriesHeader.jsx';
import CategoriesTable from './CategoriesTable.jsx';

/**
 * The Categories page.
 */
function Categories() {
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
				<CategoriesHeader />
				<CategoriesTable />
			</div>
		</>
	);
}

export default Categories;
