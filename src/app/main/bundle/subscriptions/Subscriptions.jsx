import { useThemeMediaQuery } from '@fuse/hooks/index.js';
import FusePageCarded from '@fuse/core/FusePageCarded/index.js';
import SubscriptionsHeader from './SubscriptionsHeader.jsx';
import SubscriptionsTable from './SubscriptionsTable.jsx';

/**
 * The Subscriptions page.
 */
function Subscriptions() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	return (
		<FusePageCarded
			header={<SubscriptionsHeader />}
			content={<SubscriptionsTable />}
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default Subscriptions;
