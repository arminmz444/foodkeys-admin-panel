import GlobalStyles from '@mui/material/GlobalStyles';
import OrdersHeader from './OrdersHeader.jsx';
import OrdersTable from './OrdersTable.jsx';

/**
 * The payments page.
 */
function Orders() {
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
				<OrdersHeader />
				<OrdersTable />
			</div>
		</>
	);
}

export default Orders;
