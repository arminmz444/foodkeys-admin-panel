import GlobalStyles from '@mui/material/GlobalStyles';
import PaymentsHeader from './PaymentsHeader.jsx';
import PaymentsTable from './PaymentsTable.jsx';

/**
 * The payments page.
 */
function Payments() {
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
				<PaymentsHeader />
				<PaymentsTable />
			</div>
		</>
	);
}

export default Payments;
