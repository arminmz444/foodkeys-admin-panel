import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';

const MUI_X_PRODUCTS = [
	{
		id: 'grid',
		label: 'Data Grid',
		children: [
			{ id: 'grid-community', label: '@mui/x-data-grid' },
			{ id: 'grid-pro', label: '@mui/x-data-grid-pro' },
			{
				id: 'grid-premium',
				label: '@mui/x-data-grid-premium',
				children: [{ id: 'grid-community2', label: '@mui/x-data-grid' }]
			}
		]
	},
	{
		id: 'pickers',
		label: 'Date and Time Pickers',
		children: [
			{ id: 'pickers-community', label: '@mui/x-date-pickers' },
			{ id: 'pickers-pro', label: '@mui/x-date-pickers-pro' }
		]
	},
	{
		id: 'charts',
		label: 'Charts',
		children: [{ id: 'charts-community', label: '@mui/x-charts' }]
	},
	{
		id: 'tree-view',
		label: 'Tree View',
		children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }]
	}
];

export default function CustomTreeView() {
	return (
		<RichTreeView
			items={MUI_X_PRODUCTS}
			slots={{ item: TreeItem2 }}
		/>
	);
}
