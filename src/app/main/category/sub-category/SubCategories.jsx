import GlobalStyles from '@mui/material/GlobalStyles';
import SubCategoriesHeader from './SubCategoriesHeader.jsx';
import SubCategoriesTable from './SubCategoriesTable.jsx';

/**
 * The SubCategories page.
 */
function SubCategories() {
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
				<SubCategoriesHeader />
				<SubCategoriesTable />
			</div>
		</>
	);
}

export default SubCategories;
