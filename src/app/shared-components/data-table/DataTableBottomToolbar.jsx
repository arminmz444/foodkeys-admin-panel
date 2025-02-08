// DataTableBottomToolbar.jsx

import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
	MRT_LinearProgressBar,
	MRT_TablePagination,
	MRT_ToolbarAlertBanner,
	MRT_ToolbarDropZone
} from 'material-react-table';

/**
 * Custom Bottom Toolbar for material-react-table
 * to ensure the pagination is fully visible and the layout is stable.
 */
function DataTableBottomToolbar({ table }) {
	const {
		getState,
		options: {
			enablePagination = true,
			enableToolbarInternalActions,
			muiBottomToolbarProps,
			positionPagination,
			positionToolbarDropZone,
			renderBottomToolbarCustomActions
		},
		refs: { bottomToolbarRef }
	} = table;

	// if you need to detect screen sizes
	const isMobile = useMediaQuery('(max-width:720px)');
	const isTablet = useMediaQuery('(max-width:1024px)');

	// your table state
	const { isFullScreen } = getState();

	// parse props if you allow function/values (like you did for top toolbar)
	const toolbarProps = parseFromValuesOrFunc(muiBottomToolbarProps, { table });

	// If you want to stack the alert banner for smaller screens
	const stackAlertBanner = isMobile || !!renderBottomToolbarCustomActions;

	return (
		<div className="flex flex-col w-full py-4 px-12 border-t-1">
			<Box
				className="flex flex-col w-full items-center"
				{...toolbarProps}
				ref={(ref) => {
					bottomToolbarRef.current = ref;

					if (toolbarProps?.ref) {
						toolbarProps.ref.current = ref;
					}
				}}
				sx={(theme) => ({
					// NOTE: This background color might need to match your MRT theme or the container
					backgroundColor: table.options.mrtTheme?.baseBackgroundColor,
					transition: 'all 150ms ease-in-out',
					zIndex: 1,
					position: isFullScreen ? 'sticky' : 'relative',
					bottom: isFullScreen ? '0' : undefined,
					// merge any custom sx from muiBottomToolbarProps
					...parseFromValuesOrFunc(toolbarProps?.sx, theme)
				})}
			>
				{['both', 'bottom'].includes(positionToolbarDropZone ?? '') && <MRT_ToolbarDropZone table={table} />}

				<div className="flex w-full items-center justify-end">
					{/* <div className="flex items-center space-x-4 ml-8"> */}
					{/*	/!* Custom actions on the bottom toolbar *!/ */}
					{/*	{renderBottomToolbarCustomActions?.({ table }) ?? null} */}
					{/* </div> */}
					<div className="flex items-center space-x-4">
						<MRT_TablePagination
							position="bottom"
							table={table}
						/>
						<MRT_LinearProgressBar
							isTopToolbar={false}
							table={table}
						/>
					</div>
					{/*	{( */}
					{/*		<div className="flex items-center space-x-4"> */}
					{/*			{true && ['both', 'bottom'].includes(positionPagination ?? 'bottom') && ( */}
					{/*				<MRT_TablePagination */}
					{/*					position="bottom" */}
					{/*					table={table} */}
					{/*				/> */}
					{/*			)} */}

					{/*			<MRT_LinearProgressBar */}
					{/*				isTopToolbar={false} */}
					{/*				table={table} */}
					{/*			/> */}
					{/*		</div> */}
					{/*	)} */}
				</div>
			</Box>

			{/* Show an alert banner below if needed */}
			<MRT_ToolbarAlertBanner
				className="mt-4 rounded-md flex justify-center"
				stackAlertBanner={stackAlertBanner}
				table={table}
				sx={{
					'& .MuiStack-root': {
						display: 'flex',
						justifyContent: 'center',
						width: '100%',
						fontSize: 13
					}
				}}
			/>
		</div>
	);
}

export const parseFromValuesOrFunc = (fn, arg) => (fn instanceof Function ? fn(arg) : fn);
export const getValueAndLabel = (option) => {
	let label = '';
	let value = '';

	if (option) {
		if (typeof option !== 'object') {
			label = option;
			value = option;
		} else {
			label = option.label ?? option.text ?? option.value;
			value = option.value ?? label;
		}
	}

	return { label, value };
};

export default DataTableBottomToolbar;
