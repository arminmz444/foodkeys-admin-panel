import GlobalStyles from '@mui/material/GlobalStyles';
import { useParams } from 'react-router-dom';
import SubCategoryHeader from './SubCategoryHeader';

/**
 * The SubCategory Details page.
 */
function SubCategoryDetails() {
	const { id } = useParams();
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
				<SubCategoryHeader id={id} />
			</div>
		</>
	);
}

export default SubCategoryDetails;
