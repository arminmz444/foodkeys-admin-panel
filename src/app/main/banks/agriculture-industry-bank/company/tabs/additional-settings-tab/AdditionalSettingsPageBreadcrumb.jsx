import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { Link, useLocation } from 'react-router-dom';
import AdditionalSettingsNavigation from './AdditionalSettingsNavigation';

const getPathTree = (departmentTree, url) => {
	function findPath(node, _url) {
		if (node.url === _url) {
			return [];
		}

		if (node.children) {
			// eslint-disable-next-line no-restricted-syntax
			for (const child of node.children) {
				const childPath = findPath(child, _url);

				if (Array.isArray(childPath)) {
					childPath.unshift(child);
					return childPath;
				}
			}
		}

		return false;
	}

	const response = findPath(departmentTree, url);
	return response || [];
};

/**
 * More Settings Page Breadcrumb
 */
function AdditionalSettingsPageBreadcrumb(props) {
	const { className } = props;
	const { pathname } = useLocation();
	const pathArr = getPathTree(AdditionalSettingsNavigation, pathname);
	return (
		<div className={clsx('flex-1 mb-16 sm:mb-0', className)}>
			<Breadcrumbs aria-label="breadcrumb">
				<Link
					className="font-semibold hover:underline"
					color="secondary"
					to="/additional-settings"
					role="button"
				>
					تنظیمات بیشتر
				</Link>
				{pathArr.map((item) => (
					<Typography
						key={item.id}
						className="cursor-default"
					>
						{item.title}
					</Typography>
				))}
			</Breadcrumbs>
		</div>
	);
}

export default AdditionalSettingsPageBreadcrumb;
