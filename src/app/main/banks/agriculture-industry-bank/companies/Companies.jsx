import GlobalStyles from '@mui/material/GlobalStyles';
import CompaniesHeader from 'app/shared-components/companies-table/CompaniesHeader.jsx';
import CompaniesTable from 'app/shared-components/companies-table/CompaniesTable.jsx';

/**
 * The companies page.
 */
function Companies() {
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
				<CompaniesHeader />
				<CompaniesTable />
			</div>
		</>
	);
}

export default Companies;
