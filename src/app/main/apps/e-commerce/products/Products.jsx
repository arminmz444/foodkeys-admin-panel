import GlobalStyles from '@mui/material/GlobalStyles';
import ProductsHeader from './ProductsHeader';
import ProductsTable from './ProductsTable';

/**
 * The companies page.
 */
function Products() {
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
				<ProductsHeader />
				<ProductsTable />
			</div>
		</>
	);
}

export default Products;
