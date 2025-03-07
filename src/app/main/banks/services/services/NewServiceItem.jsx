import FuseSvgIcon from '@fuse/core/FuseSvgIcon/index.js';
import Box from '@mui/material/Box';
import { useCreateScrumboardBoardMutation } from '../ServicesBankApi';

/**
 * The new service item component.
 */
function NewServiceItem() {
	const [createNewBoard] = useCreateScrumboardBoardMutation();

	function handleNewBoard() {
		createNewBoard({});
	}

	return (
		<Box
			sx={{
				borderColor: 'divider'
			}}
			className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer border-2 border-gray-300 border-dashed hover:bg-hover transition-colors duration-150 ease-in-out"
			onClick={handleNewBoard}
			onKeyDown={handleNewBoard}
			role="button"
			tabIndex={0}
		>
			<FuseSvgIcon
				size={48}
				color="disabled"
			>
				heroicons-outline:plus
			</FuseSvgIcon>
		</Box>
	);
}

export default NewServiceItem;
